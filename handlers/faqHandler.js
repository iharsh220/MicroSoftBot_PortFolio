const { card } = require('../utils/reply');
const { getFaqCard } = require('../cards/faqCard');

async function handleFaq(context) {
  await card(context, 'Frequently Asked Questions:', getFaqCard());
}

module.exports = handleFaq;