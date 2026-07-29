const { card } = require('../utils/reply');
const { getMenuCard } = require('../cards/menuCard');

async function handleHelp(context) {
  await card(context, 'Main Menu:', getMenuCard());
}

module.exports = handleHelp;