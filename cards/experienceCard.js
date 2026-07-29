function getExperienceCard() {
  const data = require('../data/experience.json');

  const body = [
    {
      type: 'TextBlock',
      text: 'Work Experience',
      weight: 'Bolder',
      size: 'Medium'
    }
  ];

  for (const exp of data.experiences) {
    body.push({
      type: 'TextBlock',
      text: `${exp.role} at ${exp.company}`,
      weight: 'Bolder',
      size: 'Small',
      spacing: 'Medium'
    });
    body.push({
      type: 'TextBlock',
      text: exp.period,
      size: 'Small',
      isSubtle: true
    });
    body.push({
      type: 'TextBlock',
      text: exp.description,
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

module.exports = { getExperienceCard };