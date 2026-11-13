/* ============================================================
   HARSH GOHIL · PORTFOLIO WEB CHAT
   3D orb (Three.js r128) + rich cards rendered from /chat/api
   ============================================================ */
(function () {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const root = document.documentElement;
  const app = $('#app');
  const scroll = $('#scroll');
  const log = $('#log');
  const input = $('#input');
  const suggest = $('#suggest');
  const sendBtn = $('#sendBtn');
  const isEmbed = window.self !== window.top;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const API = 'api';

  /* ── DOM helper (all dynamic text goes through textContent) ── */
  function el(tag, attrs, ...kids) {
    const n = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null || v === false) continue;
        if (k === 'class') n.className = v;
        else if (k === 'html') n.innerHTML = v; // only ever used with constant SVG strings below
        else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
        else n.setAttribute(k, v === true ? '' : v);
      }
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      n.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return n;
  }

  const ICON = {
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M8 7h9v9"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10" style="vertical-align:-1px"><path d="M12 2l3 7 7 .6-5.3 4.7 1.6 7.2L12 17.8 5.7 21.5l1.6-7.2L2 9.6 9 9z"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5zM5.3 7.4a2.1 2.1 0 1 1 0-4.1 2.1 2.1 0 0 1 0 4.1zM7.1 20.5H3.6V9h3.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0z"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.7 1.6.2 2.8.1 3.2.8.8 1.3 1.9 1.3 3.1 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3"/></svg>',
    location: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    bot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M9 17h6"/></svg>',
    server: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><path d="M7 7h.01M7 17h.01"/></svg>',
    cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19a4.5 4.5 0 1 0-1.4-8.8A6 6 0 1 0 6 17.7"/><path d="M6 19h11.5"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>'
  };

  /* ── THEME ───────────────────────────────────────────────── */
  const Theme = (() => {
    const btn = $('#themeBtn');
    const order = ['system', 'light', 'dark'];
    let mode = root.getAttribute('data-theme') || 'system';
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const isDark = () => (mode === 'system' ? mq.matches : mode === 'dark');
    function apply(m, save) {
      mode = order.includes(m) ? m : 'system';
      if (mode === 'system') root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', mode);
      btn.dataset.mode = mode;
      btn.setAttribute('aria-label', 'Theme: ' + { system: 'Auto', light: 'Light', dark: 'Dark' }[mode]);
      if (save) {
        try { mode === 'system' ? localStorage.removeItem('hg-theme') : localStorage.setItem('hg-theme', mode); } catch (e) {}
      }
      window.dispatchEvent(new CustomEvent('themechange', { detail: { dark: isDark() } }));
    }
    btn.addEventListener('click', () => apply(order[(order.indexOf(mode) + 1) % 3], true));
    mq.addEventListener && mq.addEventListener('change', () => mode === 'system' && apply('system'));
    apply(mode);
    return { apply, isDark };
  })();

  /* ── PARENT PAGE BRIDGE (when embedded in the portfolio) ─── */
  let parentOpen = !isEmbed;
  const toParent = (msg) => { if (isEmbed) window.parent.postMessage(msg, '*'); };
  window.addEventListener('message', (e) => {
    const d = e.data || {};
    if (e.source !== window.parent) return;
    if (d.type === 'hg-theme') Theme.apply(d.theme);
    if (d.type === 'hg-chat-state') {
      parentOpen = !!d.open;
      if (parentOpen) { requestAnimationFrame(() => placeOrb(false)); if (finePointer) input.focus({ preventScroll: true }); }
    }
  });
  $('#closeBtn').addEventListener('click', () => toParent({ type: 'hg-chat-close' }));
  toParent({ type: 'hg-chat-ready' });

  /* ── 3D ORB ──────────────────────────────────────────────── */
  const orbEl = $('#orb');
  const ORB_PX = 160;
  const Orb = { state: 'idle', talk() {}, setState(s) { this.state = s; } };

  function placeOrb(animate) {
    const chatting = app.classList.contains('is-chatting');
    const slot = $(chatting ? '.head-orb-slot' : '.hero-orb-slot');
    const a = app.getBoundingClientRect();
    const r = slot.getBoundingClientRect();
    if (!r.width) return;
    // The header slot is 42px; draw the orb a bit larger than the slot so the rings breathe.
    const pad = chatting ? 1.5 : 1.25;
    const size = r.width * pad;
    const s = size / ORB_PX;
    const x = r.left - a.left - (size - r.width) / 2;
    const y = r.top - a.top - (size - r.height) / 2;
    orbEl.classList.toggle('animate', !!animate && !reduceMotion);
    orbEl.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
    let op = 1;
    if (!chatting) {
      const headBottom = $('.head').getBoundingClientRect().bottom;
      const footTop = $('.foot').getBoundingClientRect().top;
      op = Math.max(0, Math.min(1, (r.bottom - headBottom) / (r.height * 0.6), (footTop - r.top) / (r.height * 0.6)));
    }
    orbEl.style.opacity = op;
  }
  scroll.addEventListener('scroll', () => { if (!app.classList.contains('is-chatting')) placeOrb(false); }, { passive: true });
  window.addEventListener('resize', () => placeOrb(false), { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(() => placeOrb(false)).observe(app);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => placeOrb(false));

  function initOrb() {
    const canvas = $('#orbCanvas');
    if (!window.THREE) { orbEl.classList.add('no-webgl'); return; }
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch (e) { orbEl.classList.add('no-webgl'); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75) * 1.25);
    renderer.setSize(ORB_PX, ORB_PX, false);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
    camera.position.set(0, 0, 6.4);

    const NOISE = `
      vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
      vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
      vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
      float snoise(vec3 v){
        const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
        vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
        vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
        vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);
        vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
        float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);
        vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;
        vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
        vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
        vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
        vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
        vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
        p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
        vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
        return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}`;

    const U = {
      uTime: { value: 0 }, uAmp: { value: 0.22 }, uFreq: { value: 1.0 },
      uC1: { value: new THREE.Color('#d4ff3a') }, uC2: { value: new THREE.Color('#ff3d8b') },
      uC3: { value: new THREE.Color('#7b5cff') }, uC4: { value: new THREE.Color('#22e3ff') }
    };
    const blobMat = new THREE.ShaderMaterial({
      uniforms: U,
      vertexShader: `
        uniform float uTime; uniform float uAmp; uniform float uFreq;
        varying vec3 vN; varying vec3 vView; varying float vNoise;
        ${NOISE}
        void main(){
          float n = snoise(position * 0.9 * uFreq + vec3(uTime * 0.25));
          n += 0.45 * snoise(position * 2.2 * uFreq - vec3(uTime * 0.35));
          vNoise = n;
          vec3 p = position + normal * n * uAmp;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          vN = normalize(normalMatrix * normal);
          vView = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uC3; uniform vec3 uC4;
        varying vec3 vN; varying vec3 vView; varying float vNoise;
        void main(){
          float f = pow(1.0 - max(dot(vN, vView), 0.0), 2.2);
          float t = vNoise * 0.5 + 0.5;
          vec3 base = mix(uC3, uC2, smoothstep(0.15, 0.75, t));
          base = mix(base, uC1, smoothstep(0.62, 1.0, t + vN.y * 0.25));
          vec3 col = mix(base, uC4, f * 0.85);
          float spec = pow(max(dot(reflect(-vView, vN), normalize(vec3(0.4, 0.8, 0.6))), 0.0), 28.0);
          col += spec * 0.65 + f * 0.25;
          gl_FragColor = vec4(col, 1.0);
        }`
    });

    const group = new THREE.Group();
    scene.add(group);
    const blob = new THREE.Mesh(new THREE.IcosahedronGeometry(1.15, 40), blobMat);
    group.add(blob);
    const shellMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.1 });
    const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(1.7, 1), shellMat);
    group.add(shell);

    const ringMats = [];
    const rings = [
      { r: 1.95, tilt: [1.2, 0.3], color: '#d4ff3a', speed: 0.7 },
      { r: 2.2, tilt: [-0.9, 0.6], color: '#ff3d8b', speed: -0.5 }
    ].map((o) => {
      const g = new THREE.Group();
      g.rotation.set(o.tilt[0], o.tilt[1], 0);
      const m = new THREE.MeshBasicMaterial({ color: o.color, transparent: true, opacity: 0.45 });
      ringMats.push(m);
      g.add(new THREE.Mesh(new THREE.TorusGeometry(o.r, 0.014, 8, 140), m));
      const moon = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({ color: o.color }));
      moon.position.x = o.r;
      g.add(moon);
      group.add(g);
      return { g, speed: o.speed };
    });

    function themeColors(dark) {
      shellMat.color.set(dark ? '#ffffff' : '#121018');
      shellMat.opacity = dark ? 0.1 : 0.16;
      ringMats.forEach((m) => (m.opacity = dark ? 0.45 : 0.75));
      U.uC1.value.set(dark ? '#d4ff3a' : '#c2f000');
    }
    themeColors(Theme.isDark());
    window.addEventListener('themechange', (e) => themeColors(e.detail.dark));

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    window.addEventListener('pointermove', (e) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });

    const target = { idle: { amp: 0.22, spin: 1, freq: 1 }, thinking: { amp: 0.46, spin: 3.2, freq: 1.35 } };
    let pulse = 0;
    let spin = 1;
    Orb.talk = () => { pulse = 1; };

    const clock = new THREE.Clock();
    (function frame() {
      requestAnimationFrame(frame);
      if (document.hidden || !parentOpen) { clock.getDelta(); return; }
      const dt = Math.min(clock.getDelta(), 0.05);
      const k = reduceMotion ? 0.2 : 1;
      const tgt = target[Orb.state] || target.idle;
      U.uAmp.value += (tgt.amp - U.uAmp.value) * 0.06;
      U.uFreq.value += (tgt.freq - U.uFreq.value) * 0.05;
      spin += (tgt.spin - spin) * 0.05;
      U.uTime.value += dt * k * (0.8 + spin * 0.4);
      pulse *= 0.92;
      group.scale.setScalar(1 + pulse * 0.08);
      blob.rotation.y += dt * 0.25 * spin * k;
      shell.rotation.y -= dt * 0.12 * spin * k;
      shell.rotation.x += dt * 0.05 * k;
      rings.forEach((o) => (o.g.rotation.z += dt * o.speed * spin * k));
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      group.rotation.x = mouse.y * 0.35;
      group.rotation.y = mouse.x * 0.5;
      renderer.render(scene, camera);
    })();
  }

  /* ── 3D TILT for cards ───────────────────────────────────── */
  function tilt(node, max = 7) {
    if (!finePointer || reduceMotion) return node;
    node.classList.add('tilt');
    node.append(el('span', { class: 'tilt-glare' }));
    node.addEventListener('pointermove', (e) => {
      const r = node.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      node.style.transform = `perspective(700px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) translateZ(4px)`;
      node.style.setProperty('--gx', px * 100 + '%');
      node.style.setProperty('--gy', py * 100 + '%');
    });
    node.addEventListener('pointerleave', () => { node.style.transform = ''; });
    return node;
  }

  /* ── CARD RENDERERS ──────────────────────────────────────── */
  const btn = (cls, label, icon, attrs = {}) =>
    el(attrs.href ? 'a' : 'button', { class: `btn ${cls}`, ...attrs }, icon ? el('span', { html: ICON[icon], style: 'display:contents' }) : null, label);

  const actionChip = (label, action) => el('button', { class: 'chip', type: 'button', onclick: () => send(label, action) }, label);

  const Cards = {
    menu() {
      const items = [['🎬 Live demos', 'demos'], ['👋 About', 'about'], ['🚀 Projects', 'projects'], ['⚡ Skills', 'skills'], ['💼 Experience', 'experience'],
        ['🛠 Services', 'services'], ['📄 Resume', 'resume'], ['✉️ Contact', 'contact'], ['❓ FAQ', 'faq'],
        ['🐙 GitHub', 'github'], ['🧠 Quiz', 'interview'], ['🏗 How I\'m built', 'architecture']];
      return el('div', { class: 'card' },
        el('span', { class: 'card-label' }, 'Main menu'),
        el('div', { class: 'menu-grid' }, items.map(([l, a]) => actionChip(l, a))));
    },

    about(d) {
      return tilt(el('div', { class: 'card card-grid-bg' },
        el('div', { class: 'about-top' },
          el('div', { class: 'mono-avatar' }, 'HG'),
          el('div', null,
            el('h3', null, d.name),
            el('p', { style: 'font-size:.78rem' }, `${d.role} · ${d.company}`),
            el('span', { class: 'status-pill' }, el('i'), d.status))),
        el('p', null, d.summary),
        el('div', { class: 'stats' }, d.stats.map((s) => el('div', { class: 'stat' }, el('b', null, s.value), el('span', null, s.label)))),
        d.languages ? el('div', { class: 'meta-row' }, el('small', null, 'Speaks'), el('div', { class: 'tags' }, d.languages.map((l) => el('span', { class: 'tag' }, l)))) : null,
        d.interests ? el('div', { class: 'meta-row' }, el('small', null, 'Into'), el('div', { class: 'tags' }, d.interests.map((l) => el('span', { class: 'tag' }, l)))) : null,
        el('div', { class: 'btns' },
          btn('btn-lime', 'Resume', 'download', { href: d.files.resume, target: '_blank', rel: 'noopener', download: true }),
          btn('btn-ghost', 'Cover letter', 'download', { href: d.files.coverLetter, target: '_blank', rel: 'noopener', download: true }))
      ));
    },

    resume(d) {
      return tilt(el('div', { class: 'card card-grid-bg' },
        el('span', { class: 'card-label' }, 'Documents'),
        el('h3', null, d.name),
        el('p', null, `${d.role} · 8+ years in backend and full stack development.`),
        el('div', { class: 'btns' },
          btn('btn-lime', 'Download resume', 'download', { href: d.files.resume, target: '_blank', rel: 'noopener', download: true }),
          btn('btn-ghost', 'Cover letter', 'download', { href: d.files.coverLetter, target: '_blank', rel: 'noopener', download: true }))
      ));
    },

    projects(d) {
      const track = el('div', { class: 'carousel' });
      d.items.forEach((p, i) => {
        const card = el('article', { class: 'proj' },
          el('span', { class: 'proj-num' }, String(i + 1).padStart(2, '0') + ' / ' + String(d.items.length).padStart(2, '0')),
          p.company ? el('span', { class: 'proj-co' }, p.company) : null,
          el('h4', null, p.name),
          el('p', null, p.description),
          p.impact ? el('p', { class: 'proj-impact' }, p.impact) : null,
          el('div', { class: 'tags' }, p.stack.slice(0, 5).map((s) => el('span', { class: 'tag' }, s))),
          p.demo ? btn('btn-lime demo-btn', 'Watch demo', 'play', { type: 'button', onclick: () => send(`Watch ${p.name} demo`, 'demo:' + p.demo) }) : null);
        track.append(tilt(card, 9));
      });
      const wrap = el('div', { class: 'carousel-wrap' }, track);
      if (d.items.length > 1) {
        const dots = el('div', { class: 'dots' }, d.items.map((_, i) => el('i', { class: i === 0 ? 'on' : null })));
        const prev = el('button', { class: 'car-nav prev', 'aria-label': 'Previous project', html: ICON.left, disabled: true });
        const next = el('button', { class: 'car-nav next', 'aria-label': 'Next project', html: ICON.right });
        const step = () => track.firstElementChild.getBoundingClientRect().width + 10;
        prev.onclick = () => track.scrollBy({ left: -step(), behavior: 'smooth' });
        next.onclick = () => track.scrollBy({ left: step(), behavior: 'smooth' });
        track.addEventListener('scroll', () => {
          const i = Math.round(track.scrollLeft / step());
          [...dots.children].forEach((dot, j) => dot.classList.toggle('on', j === i));
          prev.disabled = track.scrollLeft < 8;
          next.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 8;
        }, { passive: true });
        wrap.append(prev, next);
        return el('div', null, wrap, dots);
      }
      return wrap;
    },

    skills(d) {
      return el('div', { class: 'card' },
        el('span', { class: 'card-label' }, 'Tech stack'),
        d.categories.map((c) => el('div', { class: 'skill-cat' },
          el('h5', null, c.category),
          el('div', { class: 'tags' }, c.skills.map((s) => el('button', { class: 'tag', type: 'button', onclick: () => send(`Do you know ${s}?`) }, s))))));
    },

    experience(d) {
      return el('div', { class: 'card' },
        el('span', { class: 'card-label' }, 'Experience'),
        el('div', { class: 'tl' }, d.items.map((x, i) => el('div', { class: 'tl-item' },
          el('span', { class: 'tl-period' }, `${x.period} · ${x.location}`),
          el('p', { class: 'tl-role' }, x.role),
          el('p', { class: 'tl-co' }, x.company),
          el('p', { class: 'tl-desc' }, x.description),
          x.highlights && x.highlights.length ? el('details', { class: 'tl-more', open: d.items.length === 1 || null },
            el('summary', null, `${x.highlights.length} highlights`),
            el('ul', null, x.highlights.map((h) => el('li', null, h)))) : null))));
    },

    education(d) {
      return el('div', { class: 'card card-grid-bg' },
        el('span', { class: 'card-label' }, 'Education'),
        d.items.map((e) => el('div', null,
          el('h3', null, `${e.degree}, ${e.field}`),
          el('p', { style: 'margin-top:4px' }, `${e.institution} · ${e.location}`),
          el('span', { class: 'tag', style: 'display:inline-block;margin-top:10px' }, e.period))));
    },

    timeline(d) {
      return el('div', { class: 'card' },
        el('span', { class: 'card-label' }, 'Career timeline'),
        el('div', { class: 'tl compact' }, [...d.items].reverse().map((e) => el('div', { class: 'tl-item' },
          el('span', { class: 'tl-year' }, e.year),
          el('p', { class: 'tl-desc', style: 'margin-top:0' }, e.event)))));
    },

    services(d) {
      return el('div', { class: 'card' },
        el('span', { class: 'card-label' }, 'Services'),
        el('div', { class: 'svc-grid' }, d.items.map((s) => tilt(el('div', { class: 'svc' },
          el('div', { class: 'svc-ico', html: ICON[s.icon] || ICON.spark }),
          el('b', null, s.title),
          el('span', null, s.desc)), 10))),
        el('div', { class: 'btns' }, btn('btn-lime', 'Hire me', 'arrow', { type: 'button', onclick: () => send('Contact', 'contact') })));
    },

    contact(d) {
      return el('div', { class: 'card' },
        el('span', { class: 'card-label' }, 'Get in touch'),
        el('div', { class: 'contact-list' }, d.items.map((c) => {
          const inner = [
            el('span', { class: 'c-ico', html: ICON[c.kind] || ICON.email }),
            el('span', { class: 'c-txt' }, el('small', null, c.label), el('span', null, c.value))
          ];
          const ext = /^https?:/.test(c.href);
          const rowEl = c.href
            ? el('a', { class: 'c-row', href: c.href, target: ext ? '_blank' : null, rel: ext ? 'noopener' : null }, inner)
            : el('div', { class: 'c-row' }, inner);
          if (c.kind === 'email' || c.kind === 'phone') {
            const cp = el('button', { class: 'copy', type: 'button', 'aria-label': `Copy ${c.label}`, html: ICON.copy });
            cp.addEventListener('click', (e) => {
              e.preventDefault(); e.stopPropagation();
              copyText(c.value).then(() => {
                cp.innerHTML = ICON.check; cp.classList.add('done');
                setTimeout(() => { cp.innerHTML = ICON.copy; cp.classList.remove('done'); }, 1600);
              });
            });
            rowEl.append(cp);
          }
          return rowEl;
        })));
    },

    faq(d) {
      return el('div', { class: 'card' },
        el('span', { class: 'card-label' }, 'FAQ'),
        d.items.map((f, i) => el('details', { class: 'faq-item', open: i === 0 || null }, el('summary', null, f.q), el('p', null, f.a))));
    },

    answer(d) {
      return el('div', { class: 'card' },
        el('p', { class: 'answer-q' }, '› ' + d.q),
        el('p', { class: 'answer-a' }, d.a));
    },

    github(d) {
      const profile = `https://github.com/${encodeURIComponent(d.user)}`;
      return el('div', { class: 'card' },
        el('span', { class: 'card-label' }, `github.com/${d.user}`),
        d.repos.map((r) => el('a', { class: 'repo', href: r.url, target: '_blank', rel: 'noopener' },
          el('b', null, r.name),
          r.description ? el('p', null, r.description) : null,
          el('div', { class: 'repo-meta' },
            r.language ? el('span', null, el('i', { class: 'lang-dot' }), r.language) : null,
            el('span', null, el('span', { html: ICON.star, style: 'display:contents' }), ' ', r.stars),
            r.updated ? el('span', null, 'updated ' + new Date(r.updated).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })) : null))),
        el('div', { class: 'btns' }, btn('btn-ghost', 'Open GitHub profile', 'arrow', { href: profile, target: '_blank', rel: 'noopener' })));
    },

    architecture(d) {
      return el('div', { class: 'card card-grid-bg' },
        el('span', { class: 'card-label' }, 'Architecture'),
        el('div', { class: 'flow' }, d.steps.map((s, i) => el('div', { class: 'flow-step' },
          el('div', { class: 'flow-rail' }, el('span', { class: 'flow-node' }, String(i + 1).padStart(2, '0')), el('span', { class: 'flow-line' })),
          el('div', { class: 'flow-body' }, el('b', null, s.title), el('span', null, s.desc))))));
    },

    demos(d) {
      const fmt = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
      let proj = d.projects.find((p) => p.id === d.focus) || d.projects[0];
      let cur = 0;
      const node = el('div', { class: 'card demo-card' });
      const tabs = el('div', { class: 'demo-tabs', role: 'tablist' });
      const stage = el('div', { class: 'demo-stage' });
      const video = el('video', { controls: true, playsinline: true, preload: 'none', controlslist: 'nodownload' });
      stage.append(video);
      const now = el('div', { class: 'demo-now' });
      const list = el('ol', { class: 'demo-list' });
      const extra = el('div');
      node.append(tabs, stage, now, list, extra);

      function load(i, play) {
        cur = i;
        const v = proj.videos[i];
        // Pause other demo players in the chat so only one plays at a time.
        document.querySelectorAll('.demo-stage video').forEach((x) => x !== video && x.pause());
        video.poster = v.poster;
        video.src = v.src;
        stage.classList.toggle('portrait', v.portrait);
        now.textContent = '';
        now.append(
          el('div', { class: 'demo-now-top' },
            el('span', { class: 'demo-ep' }, `EP ${String(i + 1).padStart(2, '0')} / ${String(proj.videos.length).padStart(2, '0')}`),
            el('span', { class: 'demo-dur' }, fmt(v.duration))),
          el('h4', null, v.title),
          el('p', null, v.desc));
        [...list.children].forEach((li, j) => {
          li.classList.toggle('on', j === i);
          li.firstChild.setAttribute('aria-current', j === i ? 'true' : 'false');
        });
        if (play) video.play().catch(() => {});
      }
      video.addEventListener('play', () => { Orb.talk(); document.querySelectorAll('.demo-stage video').forEach((x) => x !== video && x.pause()); });
      video.addEventListener('ended', () => { if (cur < proj.videos.length - 1) load(cur + 1, true); });

      function selectProject(p) {
        proj = p;
        [...tabs.children].forEach((b) => b.setAttribute('aria-selected', b.dataset.id === p.id ? 'true' : 'false'));
        list.textContent = '';
        p.videos.forEach((v, i) => {
          list.append(el('li', null, el('button', { type: 'button', onclick: () => load(i, true) },
            el('span', { class: 'thumb' }, el('img', { src: v.poster, alt: '', loading: 'lazy' }), el('span', { class: 'thumb-play', html: ICON.play })),
            el('span', { class: 'demo-li-txt' }, el('b', null, v.title), el('small', null, `EP ${String(i + 1).padStart(2, '0')} · ${fmt(v.duration)}`)))));
        });
        extra.textContent = '';
        extra.append(el('div', { class: 'demo-about' },
          el('p', null, p.description),
          el('div', { class: 'tags' }, p.stack.map((s) => el('span', { class: 'tag' }, s)))));
        if (p.download) {
          extra.append(el('div', { class: 'demo-dl' },
            btn('btn-lime', p.download.label, 'download', { href: p.download.href, download: 'DataAccessAuditor.exe' }),
            el('small', null, p.download.meta),
            el('p', { class: 'demo-note' }, p.download.note)));
        }
        load(0, false);
      }

      d.projects.forEach((p) => {
        const b = el('button', { class: 'demo-tab', type: 'button', role: 'tab', 'data-id': p.id },
          el('span', { class: 'demo-tab-ico' }, p.icon), el('span', null, el('b', null, p.name), el('small', null, `${p.videos.length} videos · ${p.tagline}`)));
        b.addEventListener('click', () => { video.pause(); selectProject(p); });
        tabs.append(b);
      });
      selectProject(proj);
      return node;
    },

    quiz(d) {
      const qs = d.questions;
      let idx = 0, score = 0;
      const body = el('div');
      const node = el('div', { class: 'card' }, body);
      const letters = 'ABCD';
      function render() {
        body.textContent = '';
        if (idx >= qs.length) return result();
        const q = qs[idx];
        const bar = el('i');
        body.append(
          el('div', { class: 'quiz-top' }, el('span', { class: 'quiz-count' }, `Question ${idx + 1} / ${qs.length}`), el('span', { class: 'quiz-score' }, `Score ${score}`)),
          el('div', { class: 'quiz-bar' }, bar),
          el('p', { class: 'quiz-q' }, q.question));
        const opts = el('div', { class: 'quiz-opts' });
        q.options.forEach((o, i) => {
          const b = el('button', { class: 'opt', type: 'button' }, el('i', null, letters[i]), o);
          b.addEventListener('click', () => {
            [...opts.children].forEach((c) => (c.disabled = true));
            const ok = i === q.correct;
            if (ok) score++;
            b.classList.add(ok ? 'right' : 'wrong');
            if (!ok) opts.children[q.correct].classList.add('right');
            Orb.talk();
            setTimeout(() => { idx++; render(); }, ok ? 750 : 1300);
          });
          opts.append(b);
        });
        body.append(opts);
        requestAnimationFrame(() => (bar.style.width = (idx / qs.length) * 100 + '%'));
      }
      function result() {
        const pct = score / qs.length;
        const C = 2 * Math.PI * 46;
        const ring = el('div', { class: 'ring', html:
          `<svg viewBox="0 0 110 110"><defs><linearGradient id="ringGrad" x1="0" x2="1"><stop offset="0" stop-color="var(--lime)"/><stop offset="1" stop-color="var(--pink)"/></linearGradient></defs>` +
          `<circle class="track" cx="55" cy="55" r="46"/><circle class="val" cx="55" cy="55" r="46" stroke-dasharray="${C}" stroke-dashoffset="${C}"/></svg>` });
        ring.append(el('b', null, `${score}/${qs.length}`));
        const msg = pct === 1 ? 'Perfect score. We should talk 😉' : pct >= 0.75 ? 'Solid backend instincts!' : pct >= 0.5 ? 'Not bad at all.' : 'Good warm-up. Try again?';
        body.append(el('div', { class: 'quiz-result' }, ring,
          el('h3', null, msg),
          el('div', { class: 'btns', style: 'justify-content:center' },
            btn('btn-lime', 'Retry', null, { type: 'button', onclick: () => { idx = 0; score = 0; render(); } }),
            btn('btn-ghost', 'Contact Harsh', null, { type: 'button', onclick: () => send('Contact', 'contact') }))));
        requestAnimationFrame(() => requestAnimationFrame(() => (ring.querySelector('.val').style.strokeDashoffset = C * (1 - pct))));
      }
      render();
      return node;
    }
  };

  function copyText(s) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(s).catch(() => fallback());
    return Promise.resolve(fallback());
    function fallback() {
      const ta = el('textarea', { style: 'position:fixed;opacity:0' }); ta.value = s;
      document.body.append(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      ta.remove();
    }
  }

  /* ── CONVERSATION ────────────────────────────────────────── */
  let busy = false;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));

  function toBottom() { requestAnimationFrame(() => (scroll.scrollTop = scroll.scrollHeight)); }

  function startChatting() {
    if (app.classList.contains('is-chatting')) return;
    app.classList.add('is-chatting');
    placeOrb(true);
  }

  function addUser(text) {
    log.append(el('div', { class: 'row user' }, el('div', { class: 'bubble' }, text)));
    toBottom();
  }

  function botRow() {
    const stack = el('div', { class: 'stack' });
    log.append(el('div', { class: 'row bot' }, stack));
    return stack;
  }

  function renderMessage(stack, m) {
    if (m.type === 'text') stack.append(el('div', { class: 'bubble' }, m.text));
    else if (m.type === 'card' && Cards[m.card]) stack.append(Cards[m.card](m.data || {}));
  }

  function setSuggestions(list) {
    suggest.textContent = '';
    (list || []).forEach((s, i) => {
      const c = el('button', { class: 'chip', type: 'button', style: `animation-delay:${i * 40}ms` }, s);
      c.addEventListener('click', () => send(s));
      suggest.append(c);
    });
  }

  function setThinking(on) {
    Orb.setState(on ? 'thinking' : 'idle');
    app.classList.toggle('is-thinking', on);
    $('#statusText').textContent = on ? 'Thinking…' : 'Online · replies instantly';
  }

  async function send(label, action) {
    const text = String(label || '').trim();
    if (!text || busy) return;
    busy = true;
    sendBtn.disabled = true;
    startChatting();
    addUser(text);
    setSuggestions([]);
    setThinking(true);
    const stack = botRow();
    const typing = el('div', { class: 'bubble typing', 'aria-label': 'Typing' }, el('i'), el('i'), el('i'));
    stack.append(typing);
    toBottom();

    let data;
    try {
      const [res] = await Promise.all([
        fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(action ? { action } : { text }) }),
        wait(550)
      ]);
      data = await res.json();
    } catch (e) {
      data = { messages: [{ type: 'text', text: "I can't reach the server right now. Please check your connection and try again." }], suggestions: ['Menu'] };
    }

    typing.remove();
    setThinking(false);
    for (const [i, m] of (data.messages || []).entries()) {
      if (i) await wait(260);
      renderMessage(stack, m);
      Orb.talk();
      toBottom();
    }
    setSuggestions(data.suggestions);
    busy = false;
    sendBtn.disabled = false;
  }

  $('#composer').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value;
    input.value = '';
    send(v);
  });
  document.querySelectorAll('[data-action]').forEach((b) =>
    b.addEventListener('click', () => send(b.querySelector('b') ? b.querySelector('b').textContent : b.textContent.replace(/^\W+/, ''), b.dataset.action)));

  $('#resetBtn').addEventListener('click', () => {
    if (busy) return;
    log.textContent = '';
    setSuggestions([]);
    app.classList.remove('is-chatting');
    scroll.scrollTop = 0;
    requestAnimationFrame(() => placeOrb(true));
  });

  /* ── BOOT ────────────────────────────────────────────────── */
  placeOrb(false);
  initOrb();
  if (finePointer && !isEmbed) input.focus({ preventScroll: true });
})();
