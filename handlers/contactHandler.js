const { card } = require('../utils/reply');
const { getContactCard } = require('../cards/contactCard');

async function handleContact(context) {
  await card(context, 'Contact Details:', getContactCard());
}

module.exports = handleContact;