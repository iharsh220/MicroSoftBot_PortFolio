const { ActivityHandler, CardFactory } = require('botbuilder');
const { getWelcomeCard } = require('./cards/welcomeCard');
const { matchIntent } = require('./utils/keywordMatcher');
const { getHandler } = require('./utils/router');
const { unknown, menu } = require('./utils/reply');

class TeamsBot extends ActivityHandler {
  constructor() {
    super();

    this.onConversationUpdate(async (context, next) => {
      if (context.activity.membersAdded) {
        for (const member of context.activity.membersAdded) {
          if (member.id !== context.activity.recipient.id) {
            await this.sendProactiveMessage(context);
          }
        }
      }
      await next();
    });

    this.onMessage(async (context, next) => {
      const text = (context.activity.text || '').trim().toLowerCase();
      const value = context.activity.value || {};
      const actionValue = (value.value || '').toString().toLowerCase();

      const keyword = actionValue || text || value.type || '';

      if (!keyword) {
        await menu(context);
        await next();
        return;
      }

      const intent = matchIntent(keyword);

      if (intent) {
        const handler = getHandler(intent);
        await handler(context);
      } else {
        await unknown(context);
      }

      await next();
    });
  }

  async sendProactiveMessage(context) {
    await context.sendActivity({
      text: 'Hello! I am Harsh Gohil\'s bot. How can I assist you today?',
      attachments: [CardFactory.adaptiveCard(getWelcomeCard())]
    });
  }
}

module.exports.TeamsBot = TeamsBot;