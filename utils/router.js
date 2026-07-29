const handlers = {
  about: require('../handlers/aboutHandler'),
  resume: require('../handlers/resumeHandler'),
  projects: require('../handlers/projectHandler'),
  services: require('../handlers/serviceHandler'),
  contact: require('../handlers/contactHandler'),
  skills: require('../handlers/skillsHandler'),
  experience: require('../handlers/experienceHandler'),
  education: require('../handlers/educationHandler'),
  timeline: require('../handlers/timelineHandler'),
  faq: require('../handlers/faqHandler'),
  github: require('../handlers/githubHandler'),
  architecture: require('../handlers/architectureHandler'),
  interview: require('../handlers/interviewHandler'),
  help: require('../handlers/helpHandler')
};

function getHandler(intent) {
  return handlers[intent] || handlers.help;
}

module.exports = { getHandler };