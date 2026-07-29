function getFaqCard() {
  const data = require('../data/faq.json');

  const body = [
    {
      type: 'TextBlock',
      text: 'Frequently Asked Questions',
      weight: 'Bolder',
      size: 'Medium'
    }
  ];

  for (const item of data.questions) {
    body.push({
      type: 'TextBlock',
      text: item.q,
      weight: 'Bolder',
      size: 'Small',
      spacing: 'Medium'
    });
    body.push({
      type: 'TextBlock',
      text: item.a,
      size: 'Small',
      wrap: true
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

module.exports = { getFaqCard };