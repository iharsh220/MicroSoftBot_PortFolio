const { card } = require('../utils/reply');
const { getServicesCard } = require('../cards/servicesCard');

async function handleService(context) {
  await card(context, 'Services:', getServicesCard());
}

module.exports = handleService;