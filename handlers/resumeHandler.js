const { card } = require('../utils/reply');
const { getResumeCard } = require('../cards/resumeCard');

async function handleResume(context) {
  await card(context, 'Resume & Cover Letter:', getResumeCard());
}

module.exports = { handleResume };