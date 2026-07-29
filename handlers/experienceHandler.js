const { card } = require('../utils/reply');
const { getExperienceCard } = require('../cards/experienceCard');

async function handleExperience(context) {
  await card(context, 'Work Experience:', getExperienceCard());
}

module.exports = { handleExperience };