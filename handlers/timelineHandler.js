const { card } = require('../utils/reply');
const { getTimelineCard } = require('../cards/timelineCard');

async function handleTimeline(context) {
  await card(context, 'Career Timeline:', getTimelineCard());
}

module.exports = { handleTimeline };