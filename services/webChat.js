// Web chat brain: turns a user message (or a quick-action) into structured
// replies that the portfolio web chat (public/chat) renders as rich cards.
// It reuses the same JSON data as the Teams bot, so content stays in one place.

const intents = require('../data/intents.json');
const profile = require('../data/profile.json');
const { projects } = require('../data/projects.json');
const { categories } = require('../data/skills.json');
const { experiences } = require('../data/experience.json');
const { education } = require('../data/education.json');
const { events } = require('../data/timeline.json');
const { questions: faq } = require('../data/faq.json');
const { questions: quiz } = require('../data/interview.json');
const demoCatalog = require('../data/demos.json');

// Demo catalog with full URLs (poster = same name .jpg)
const DEMOS = demoCatalog.projects.map((p) => ({
  ...p,
  videos: p.videos.map((v) => ({
    title: v.title,
    desc: v.desc,
    duration: v.duration,
    portrait: !!v.portrait,
    src: `${demoCatalog.base}/${v.file}.mp4`,
    poster: `${demoCatalog.base}/${v.file}.jpg`
  }))
}));

const SUGGEST = {
  default: ['About', 'Live demos', 'Projects', 'Skills', 'Contact'],
  about: ['Projects', 'Experience', 'Resume', 'Contact'],
  projects: ['Live demos', 'Skills', 'Experience', 'Contact'],
  skills: ['Projects', 'Do you know AWS?', 'Services'],
  experience: ['Timeline', 'Projects', 'Resume'],
  contact: ['Resume', 'Are you available for hire?', 'Services'],
  resume: ['About', 'Contact', 'FAQ'],
  faq: ['Contact', 'Resume', 'Services'],
  quiz: ['Projects', 'Skills', 'Menu'],
  demos: ['Projects', 'Download Data Access Auditor', 'Contact']
};

const STOP = new Set(('a an and are as at be by can do does for from have how i in is it me my of on or ' +
  'so tell the to u what when where which who why will with you your yours about any know there this').split(' '));

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const normalize = (s) => String(s || '').toLowerCase().replace(/[^\w+#./\s-]/g, ' ').replace(/\s+/g, ' ').trim();
const words = (s) => normalize(s).split(' ').filter((w) => w && !STOP.has(w));
const hasPhrase = (text, phrase) => new RegExp(`(^|[^\\w])${escapeRe(phrase)}($|[^\\w])`, 'i').test(text);

const INTENT_ALIASES = { quiz: 'interview', menu: 'help', videos: 'demos', 'live demos': 'demos' };

/** Word-boundary intent match ("which" no longer matches "hi"). Longest keyword wins. */
function matchIntent(text) {
  let best = null;
  let bestLen = 0;
  for (const [intent, keywords] of Object.entries(intents)) {
    for (const kw of keywords) {
      const k = normalize(kw);
      if (k.length > bestLen && hasPhrase(text, k)) {
        best = { intent, keyword: k };
        bestLen = k.length;
      }
    }
  }
  return best;
}

/** Best FAQ by keyword overlap; returns null when the overlap is weak. */
function matchFaq(text) {
  const t = new Set(words(text));
  if (!t.size) return null;
  let best = null;
  let bestScore = 0;
  for (const item of faq) {
    const q = words(item.q);
    const hits = q.filter((w) => t.has(w) || [...t].some((x) => x.length > 3 && (w.startsWith(x) || x.startsWith(w)))).length;
    const score = hits / Math.max(q.length, 1);
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }
  return bestScore >= 0.5 ? best : null;
}

const ALL_SKILLS = categories.flatMap((c) => c.skills.map((s) => ({ skill: s, category: c.category })));

function findSkill(text) {
  const variants = (s) => {
    const base = s.toLowerCase();
    const v = new Set([base, base.replace(/\.js$/, ''), base.replace(/js$/, ''), base.replace(/^aws /, '')]);
    return [...v].filter((x) => x.length > 1);
  };
  let best = null;
  let bestLen = 0;
  for (const entry of ALL_SKILLS) {
    for (const v of variants(entry.skill)) {
      if (v.length > bestLen && hasPhrase(text, v)) {
        best = entry;
        bestLen = v.length;
      }
    }
  }
  if (!best && hasPhrase(text, 'aws')) best = { skill: 'AWS', category: 'Cloud & DevOps' };
  return best;
}

function projectCards(list) {
  return list.map((p) => ({
    name: p.name,
    description: p.description,
    company: p.company || null,
    impact: p.impact || null,
    stack: p.tech.split(',').map((s) => s.trim()).filter(Boolean),
    demo: p.demo || null
  }));
}

function projectsUsing(skill) {
  const key = skill.toLowerCase().replace(/\.js$/, '').replace(/^aws /, '');
  return projects.filter((p) => p.tech.toLowerCase().includes(key) || p.description.toLowerCase().includes(key));
}

function findProjects(text) {
  const t = words(text).filter((w) => w.length > 2);
  if (!t.length) return [];
  return projects
    .map((p) => {
      const hay = normalize(`${p.name} ${p.description} ${p.tech}`);
      return { p, score: t.filter((w) => hasPhrase(hay, w)).length };
    })
    .filter((x) => x.score >= Math.min(2, t.length))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((x) => x.p);
}

function findCompany(text) {
  return experiences.find((e) => {
    const first = normalize(e.company).split(' ')[0];
    return first.length > 3 && hasPhrase(text, first);
  });
}

// ---------- GitHub (cached) ----------
let ghCache = { at: 0, repos: null };
async function githubRepos() {
  if (ghCache.repos && Date.now() - ghCache.at < 15 * 60 * 1000) return ghCache.repos;
  const headers = { 'User-Agent': 'portfolio-web-chat', Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(
    `https://api.github.com/users/${encodeURIComponent(profile.githubUser)}/repos?sort=updated&per_page=8`,
    { headers, signal: AbortSignal.timeout(5000) }
  );
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  const data = await res.json();
  const repos = data
    .filter((r) => !r.fork)
    .slice(0, 6)
    .map((r) => ({
      name: r.name,
      description: r.description,
      language: r.language,
      stars: r.stargazers_count,
      url: r.html_url,
      updated: r.pushed_at
    }));
  ghCache = { at: Date.now(), repos };
  return repos;
}

// ---------- Intent → reply ----------
const t = (text) => ({ type: 'text', text });
const card = (kind, data) => ({ type: 'card', card: kind, data });
const reply = (messages, suggestions = SUGGEST.default) => ({ messages, suggestions });

const builders = {
  help: () => reply([t('Here is what I can tell you about Harsh. Pick a topic or just ask me anything.'), card('menu', {})]),

  about: () => reply([
    t("Here's the short version 👇"),
    card('about', {
      name: profile.name,
      role: profile.role,
      company: profile.company,
      location: profile.location,
      status: profile.status,
      summary: profile.summary,
      stats: profile.stats,
      files: profile.files,
      languages: profile.languages,
      interests: profile.interests
    })
  ], SUGGEST.about),

  demos: (focus) => reply([
    t(focus === 'daa'
      ? 'Data Access Auditor in action. Pick any episode, and the Windows app is free to download.'
      : focus === 'qlik-bots'
        ? 'The Qlik chatbots running live on Teams, WhatsApp and Alexa:'
        : 'Real product recordings, not mock-ups. Pick a project and hit play ▶'),
    card('demos', { projects: DEMOS, focus: focus || DEMOS[0].id })
  ], SUGGEST.demos),

  resume: () => reply([
    t('Grab a copy. Both are PDFs.'),
    card('resume', { files: profile.files, name: profile.name, role: profile.role })
  ], SUGGEST.resume),

  projects: () => reply([
    t(`${projects.length} projects I've shipped. Swipe through them →`),
    card('projects', { items: projectCards(projects) })
  ], SUGGEST.projects),

  services: () => reply([
    t('End-to-end, from the first API to production.'),
    card('services', { items: profile.services })
  ], ['Contact', 'Projects', 'Do you do freelancing?']),

  contact: () => reply([
    t('Happy to chat. I usually reply within a day.'),
    card('contact', { items: profile.contact })
  ], SUGGEST.contact),

  skills: () => reply([
    t('The stack I use every day:'),
    card('skills', { categories })
  ], SUGGEST.skills),

  experience: () => reply([
    t('8+ years, three chapters:'),
    card('experience', { items: experiences })
  ], SUGGEST.experience),

  education: () => reply([card('education', { items: education })], ['Timeline', 'Experience', 'Skills']),

  timeline: () => reply([card('timeline', { items: events })], ['Experience', 'Education', 'Projects']),

  faq: () => reply([t('What recruiters usually ask:'), card('faq', { items: faq })], SUGGEST.faq),

  architecture: () => reply([
    t('How this chatbot works, from your keyboard to my answer:'),
    card('architecture', { steps: profile.architecture })
  ], ['GitHub', 'Projects', 'Skills']),

  interview: () => reply([
    t(`Quick backend quiz: ${quiz.length} questions. Let's see how you do 🧠`),
    card('quiz', { questions: quiz })
  ], SUGGEST.quiz),

  github: async () => {
    try {
      const repos = await githubRepos();
      return reply([t('Latest repositories on GitHub:'), card('github', { user: profile.githubUser, repos })], SUGGEST.projects);
    } catch (e) {
      return reply([
        t("I couldn't reach GitHub right now. You can open the profile directly:"),
        card('github', { user: profile.githubUser, repos: [] })
      ], SUGGEST.projects);
    }
  }
};

async function respond({ text, action }) {
  const raw = String(action || text || '').slice(0, 500);
  const msg = normalize(raw);

  if (!msg) return builders.help();

  // Quick actions from buttons map straight to an intent.
  const direct = INTENT_ALIASES[msg] || msg;
  if (action && action.startsWith('demo:')) return builders.demos(action.slice(5));
  if (action && builders[direct]) return builders[direct]();

  // Demo videos / downloads
  const wantsDemo = /\b(demo|demos|video|videos|watch|recording|recordings|walkthrough|screencast)\b/.test(msg);
  const mentionsDaa = /\b(auditor|daa|data access|section access|qmc)\b/.test(msg);
  const mentionsQlikBot = /\b(qlik|alexa|whatsapp|teams)\b/.test(msg) && /\b(bot|bots|chatbot|chatbots)\b/.test(msg);
  if (/\b(download|exe|install|installer)\b/.test(msg) && mentionsDaa) return builders.demos('daa');
  if (wantsDemo) return builders.demos(mentionsDaa ? 'daa' : mentionsQlikBot ? 'qlik-bots' : null);
  if (mentionsDaa) return builders.demos('daa');

  if (/\b(language|languages)\b/.test(msg) && !/\bprogramming\b/.test(msg)) {
    return reply([card('answer', { q: 'Which languages do you speak?', a: profile.languages.join(' · ') })], SUGGEST.about);
  }
  if (/\b(hobby|hobbies|interest|interests|free time|outside work)\b/.test(msg)) {
    return reply([card('answer', { q: 'What do you do outside work?', a: profile.interests.join(' · ') + '. Yes, cricket and PC games are a big part of it 🏏🎮' })], SUGGEST.about);
  }
  if (/\b(full name|real name|name)\b/.test(msg) && /\b(your|his|harsh)\b/.test(msg)) {
    return reply([card('answer', { q: 'Full name?', a: `${profile.fullName}. Most people call me Harsh.` })], SUGGEST.about);
  }

  if (/^(hi+|hello+|hey+|hola|namaste|yo|good (morning|afternoon|evening))\b/.test(msg) && msg.split(' ').length <= 4) {
    return reply([
      t("Hey 👋 I'm Harsh's assistant. Ask me about his work, skills, experience or how to reach him."),
      card('menu', {})
    ]);
  }
  if (/\b(thanks|thank you|thx|awesome|great|cool|nice)\b/.test(msg) && msg.split(' ').length <= 5) {
    return reply([t('Anytime! Anything else you want to know?')]);
  }

  // Strong intent first: the whole message is a keyword, or a multi-word keyword matched.
  const hit = matchIntent(msg);
  const strong = hit && (hit.keyword === msg || hit.keyword.includes(' '));
  if (strong && builders[hit.intent]) return builders[hit.intent]();

  const faqHit = matchFaq(msg);
  if (faqHit) return reply([card('answer', { q: faqHit.q, a: faqHit.a })], SUGGEST.faq);

  const company = findCompany(msg);
  if (company) {
    return reply([t(`About my time at ${company.company}:`), card('experience', { items: [company] })], SUGGEST.experience);
  }

  const skill = findSkill(msg);
  if (skill) {
    const used = projectsUsing(skill.skill);
    const area = skill.category === 'Other' ? '' : ` (${skill.category})`;
    const out = [t(`Yes, I work with ${skill.skill}${area}.` +
      (used.length ? ` Here's where I've used it:` : ''))];
    if (used.length) out.push(card('projects', { items: projectCards(used) }));
    return reply(out, ['Skills', 'Projects', 'Contact']);
  }

  if (hit && builders[hit.intent]) return builders[hit.intent]();

  const found = findProjects(msg);
  if (found.length) {
    return reply([t('This looks relevant:'), card('projects', { items: projectCards(found) })], SUGGEST.projects);
  }

  return reply([
    t("I'm not sure about that one yet. Try one of these, or ask about a skill like “Node.js” or “Qlik”."),
    card('menu', {})
  ]);
}

module.exports = { respond };
