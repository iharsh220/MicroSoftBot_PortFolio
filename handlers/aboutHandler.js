const { card } = require('../utils/reply');
const { getAboutCard } = require('../cards/aboutCard');

async function handleAbout(context) {
  await card(context, 'About Me:', getAboutCard());
}

module.exports = handleAbout;