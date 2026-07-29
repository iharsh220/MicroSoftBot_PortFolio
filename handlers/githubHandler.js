const { card, text } = require('../utils/reply');
const { getRepositories } = require('../services/githubService');
const { CardFactory } = require('botbuilder');

async function handleGithub(context) {
  try {
    const repos = await getRepositories();

    if (repos.length === 0) {
      await text(context, 'No repositories found.');
      return;
    }

    const body = [
      {
        type: 'TextBlock',
        text: 'Latest Repositories',
        weight: 'Bolder',
        size: 'Medium'
      }
    ];

    for (const repo of repos.slice(0, 5)) {
      body.push({
        type: 'TextBlock',
        text: repo.name,
        weight: 'Bolder',
        size: 'Small',
        spacing: 'Medium'
      });
      if (repo.description) {
        body.push({
          type: 'TextBlock',
          text: repo.description,
          size: 'Small',
          wrap: true
        });
      }
      body.push({
        type: 'FactSet',
        facts: [
          { title: 'Stars:', value: String(repo.stars) },
          { title: 'Forks:', value: String(repo.forks) },
          { title: 'Language:', value: repo.language || 'N/A' }
        ]
      });
    }

    const adaptiveCard = {
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

    await card(context, 'GitHub Repositories:', adaptiveCard);
  } catch (error) {
    await text(context, 'Failed to fetch GitHub repositories. Please try again later.');
  }
}

module.exports = { handleGithub };