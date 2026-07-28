const { ActivityHandler, CardFactory } = require('botbuilder');
const { getWelcomeCard } = require('./cards/welcomeCard');
const { getMenuCard } = require('./cards/menuCard');
const { getAboutCard } = require('./cards/aboutCard');
const { getContactCard } = require('./cards/contactCard');
const { getProjectsCard } = require('./cards/projectsCard');
const { getServicesCard } = require('./cards/servicesCard');

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

            const keyword = actionValue || text;

            if (!keyword) {
                await context.sendActivity({
                    text: "Main Menu:",
                    attachments: [CardFactory.adaptiveCard(getMenuCard())]
                });
                await next();
                return;
            }

            switch (keyword) {
                case 'about':
                    await context.sendActivity({
                        text: "Mere baare mein:",
                        attachments: [CardFactory.adaptiveCard(getAboutCard())]
                    });
                    break;
                case 'projects':
                    await context.sendActivity({
                        text: "Meri projects:",
                        attachments: [CardFactory.adaptiveCard(getProjectsCard())]
                    });
                    break;
                case 'services':
                    await context.sendActivity({
                        text: "Meri services:",
                        attachments: [CardFactory.adaptiveCard(getServicesCard())]
                    });
                    break;
                case 'contact':
                    await context.sendActivity({
                        text: "Contact details:",
                        attachments: [CardFactory.adaptiveCard(getContactCard())]
                    });
                    break;
                case 'menu':
                    await context.sendActivity({
                        text: "Main Menu:",
                        attachments: [CardFactory.adaptiveCard(getMenuCard())]
                    });
                    break;
                default:
                    if (['hi', 'hello', 'hey', 'namaste', 'start', 'help'].includes(keyword)) {
                        await context.sendActivity({
                            text: "Namaste! Niche se option choose karein 👇",
                            attachments: [CardFactory.adaptiveCard(getMenuCard())]
                        });
                    } else {
                        await context.sendActivity({
                            text: `"${text}" — samajh nahi aaya. Menu se choose karein 👇`,
                            attachments: [CardFactory.adaptiveCard(getMenuCard())]
                        });
                    }
                    break;
            }

            await next();
        });
    }

    async sendProactiveMessage(context) {
        await context.sendActivity({
            text: "👋 Namaste! Main Harsh ka bot hoon. Main aapki kaise help kar sakta hoon?",
            attachments: [CardFactory.adaptiveCard(getWelcomeCard())]
        });
    }
}

module.exports.TeamsBot = TeamsBot;
