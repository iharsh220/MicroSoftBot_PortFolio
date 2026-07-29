const { card } = require('../utils/reply');
const { getEducationCard } = require('../cards/educationCard');

async function handleEducation(context) {
  await card(context, 'Education:', getEducationCard());
}

module.exports = { handleEducation };