const { card } = require('../utils/reply');
const { getArchitectureCard } = require('../cards/architectureCard');

async function handleArchitecture(context) {
  await card(context, 'Bot Architecture:', getArchitectureCard());
}

module.exports = { handleArchitecture };