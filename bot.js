const { ActivityHandler, CardFactory } = require('botbuilder');
const { getWelcomeCard } = require('./cards/welcomeCard');
const { getMenuCard } = require('./cards/menuCard');
const { getAboutCard } = require('./cards/aboutCard');
const { getContactCard } = require('./cards/contactCard');
const { getProjectsCard } = require('./cards/projectsCard');
const { getServicesCard } = require('./cards/servicesCard');
const { getResumeCard } = require('./cards/resumeCard');

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
                    text: "Welcome! Please choose an option below.",
                    attachments: [CardFactory.adaptiveCard(getMenuCard())]
                });
                await next();
                return;
            }

            switch (keyword) {
                case 'about':
                    await context.sendActivity({
                        text: "About Me:",
                        attachments: [CardFactory.adaptiveCard(getAboutCard())]
                    });
                    break;
                case 'resume':
                    await context.sendActivity({
                        text: "Resume & Cover Letter:",
                        attachments: [CardFactory.adaptiveCard(getResumeCard())]
                    });
                    break;
                case 'projects':
                    await context.sendActivity({
                        text: "My Projects:",
                        attachments: [CardFactory.adaptiveCard(getProjectsCard())]
                    });
                    break;
                case 'services':
                    await context.sendActivity({
                        text: "Services:",
                        attachments: [CardFactory.adaptiveCard(getServicesCard())]
                    });
                    break;
                case 'contact':
                    await context.sendActivity({
                        text: "Contact Details:",
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
                    if (['hi', 'hello', 'hey', 'start', 'help'].includes(keyword)) {
                        await context.sendActivity({
                            text: "Hello! Please choose an option below.",
                            attachments: [CardFactory.adaptiveCard(getMenuCard())]
                        });
                    } else {
                        await context.sendActivity({
                            text: `"${text}" — I did not understand that. Please use the menu below.`,
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
            text: "Hello! I am Harsh Gohil's bot. How can I assist you today?",
            attachments: [CardFactory.adaptiveCard(getWelcomeCard())]
        });
    }
}

module.exports.TeamsBot = TeamsBot;
