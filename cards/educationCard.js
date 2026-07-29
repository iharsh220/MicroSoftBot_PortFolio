function getEducationCard() {
  const data = require('../data/education.json');

  const body = [
    {
      type: 'TextBlock',
      text: 'Education',
      weight: 'Bolder',
      size: 'Medium'
    }
  ];

  for (const edu of data.education) {
    body.push({
      type: 'TextBlock',
      text: `${edu.degree} in ${edu.field}`,
      weight: 'Bolder',
      size: 'Small',
      spacing: 'Medium'
    });
    body.push({
      type: 'TextBlock',
      text: `${edu.institution} — ${edu.year}`,
      size: 'Small',
      isSubtle: true
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

module.exports = { getEducationCard };