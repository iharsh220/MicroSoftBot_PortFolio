function getQuestionCard(question, options, index, total) {
  return {
    type: 'AdaptiveCard',
    version: '1.4',
    body: [
      {
        type: 'TextBlock',
        text: 'Interview Mode',
        weight: 'Bolder',
        size: 'Medium'
      },
      {
        type: 'TextBlock',
        text: `Question ${index + 1} of ${total}`,
        size: 'Small',
        isSubtle: true
      },
      {
        type: 'TextBlock',
        text: question,
        wrap: true,
        spacing: 'Small'
      }
    ],
    actions: options.map((option, i) => ({
      type: 'Action.Submit',
      title: option,
      data: {
        type: 'interview',
        action: 'answer',
        index: index,
        answer: i
      }
    })),
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json'
  };
}

function getResultCard(score, total, answers) {
  const body = [
    {
      type: 'TextBlock',
      text: 'Interview Complete!',
      weight: 'Bolder',
      size: 'Medium'
    },
    {
      type: 'TextBlock',
      text: `Final Score: ${score} / ${total}`,
      size: 'Large',
      weight: 'Bolder',
      spacing: 'Small'
    },
    {
      type: 'TextBlock',
      text: `Correct Answers: ${score}`,
      size: 'Small',
      spacing: 'Small'
    },
    {
      type: 'TextBlock',
      text: `Wrong Answers: ${total - score}`,
      size: 'Small',
      spacing: 'Small'
    }
  ];

  if (answers.length > 0) {
    body.push({
      type: 'TextBlock',
      text: 'Review:',
      weight: 'Bolder',
      size: 'Small',
      spacing: 'Medium'
    });

    answers.forEach((ans, i) => {
      body.push({
        type: 'TextBlock',
        text: `Q${i + 1}: ${ans.correct ? '✓' : '✗'}`,
        size: 'Small'
      });
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
      },
      {
        type: 'Action.Submit',
        title: 'Retry',
        data: { type: 'interview', action: 'restart' }
      }
    ],
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json'
  };
}

module.exports = { getQuestionCard, getResultCard };