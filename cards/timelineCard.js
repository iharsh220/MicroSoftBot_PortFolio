function getTimelineCard() {
  const data = require('../data/timeline.json');

  const body = [
    {
      type: 'TextBlock',
      text: 'Career Timeline',
      weight: 'Bolder',
      size: 'Medium'
    }
  ];

  for (const event of data.events) {
    body.push({
      type: 'TextBlock',
      text: `${event.year} — ${event.event}`,
      size: 'Small',
      spacing: 'Small'
    });
  }

  return {
    type: 'AdaptiveCard',
    version: '1.4',
    body,
    actions: [
      {
        type: 'Action.Submit',
        title: 'Back to Menu',
        data: { type: 'menu', value: 'menu' }
      }
    ],
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json'
  };
}

module.exports = { getTimelineCard };