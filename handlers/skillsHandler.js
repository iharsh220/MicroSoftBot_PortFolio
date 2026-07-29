const { card } = require('../utils/reply');
const { getSkillsCard } = require('../cards/skillsCard');

async function handleSkills(context) {
  await card(context, 'Technical Skills:', getSkillsCard());
}

module.exports = { handleSkills };