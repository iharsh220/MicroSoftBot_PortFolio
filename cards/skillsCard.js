function getSkillsCard() {
  return {
    type: 'AdaptiveCard',
    version: '1.4',
    body: [
      {
        type: 'TextBlock',
        text: 'Technical Skills',
        weight: 'Bolder',
        size: 'Medium'
      },
      {
        type: 'ColumnSet',
        columns: [
          {
            type: 'Column',
            width: 'stretch',
            items: [
              {
                type: 'TextBlock',
                text: 'Backend',
                weight: 'Bolder',
                size: 'Small'
              },
              {
                type: 'TextBlock',
                text: '• Node.js\n• Express\n• NestJS',
                size: 'Small',
                wrap: true
              }
            ]
          },
          {
            type: 'Column',
            width: 'stretch',
            items: [
              {
                type: 'TextBlock',
                text: 'Frontend',
                weight: 'Bolder',
                size: 'Small'
              },
              {
                type: 'TextBlock',
                text: '• React\n• Next.js',
                size: 'Small',
                wrap: true
              }
            ]
          }
        ]
      },
      {
        type: 'ColumnSet',
        columns: [
          {
            type: 'Column',
            width: 'stretch',
            items: [
              {
                type: 'TextBlock',
                text: 'Database',
                weight: 'Bolder',
                size: 'Small'
              },
              {
                type: 'TextBlock',
                text: '• PostgreSQL\n• Prisma\n• MongoDB',
                size: 'Small',
                wrap: true
              }
            ]
          },
          {
            type: 'Column',
            width: 'stretch',
            items: [
              {
                type: 'TextBlock',
                text: 'Cloud & DevOps',
                weight: 'Bolder',
                size: 'Small'
              },
              {
                type: 'TextBlock',
                text: '• Azure\n• Docker\n• Git',
                size: 'Small',
                wrap: true
              }
            ]
          }
        ]
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

module.exports = { getSkillsCard };