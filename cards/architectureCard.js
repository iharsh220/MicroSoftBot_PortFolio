function getArchitectureCard() {
  return {
    type: 'AdaptiveCard',
    version: '1.4',
    body: [
      {
        type: 'TextBlock',
        text: 'Bot Architecture',
        weight: 'Bolder',
        size: 'Medium'
      },
      {
        type: 'TextBlock',
        text: 'Browser',
        size: 'Small',
        horizontalAlignment: 'Center',
        weight: 'Bolder'
      },
      {
        type: 'TextBlock',
        text: '↓',
        horizontalAlignment: 'Center'
      },
      {
        type: 'TextBlock',
        text: 'Express Server',
        size: 'Small',
        horizontalAlignment: 'Center',
        weight: 'Bolder'
      },
      {
        type: 'TextBlock',
        text: '↓',
        horizontalAlignment: 'Center'
      },
      {
        type: 'TextBlock',
        text: 'Bot Framework SDK',
        size: 'Small',
        horizontalAlignment: 'Center',
        weight: 'Bolder'
      },
      {
        type: 'TextBlock',
        text: '↓',
        horizontalAlignment: 'Center'
      },
      {
        type: 'TextBlock',
        text: 'Intent Router',
        size: 'Small',
        horizontalAlignment: 'Center',
        weight: 'Bolder'
      },
      {
        type: 'TextBlock',
        text: '↓',
        horizontalAlignment: 'Center'
      },
      {
        type: 'TextBlock',
        text: 'Handlers',
        size: 'Small',
        horizontalAlignment: 'Center',
        weight: 'Bolder'
      },
      {
        type: 'TextBlock',
        text: '↓',
        horizontalAlignment: 'Center'
      },
      {
        type: 'TextBlock',
        text: 'Adaptive Cards + JSON Data',
        size: 'Small',
        horizontalAlignment: 'Center',
        weight: 'Bolder'
      }
    ],
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

module.exports = { getArchitectureCard };