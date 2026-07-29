const { card } = require('../utils/reply');
const { getProjectsCard } = require('../cards/projectsCard');

async function handleProject(context) {
  await card(context, 'My Projects:', getProjectsCard());
}

module.exports = { handleProject };