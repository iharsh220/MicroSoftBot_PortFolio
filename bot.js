const { ActivityHandler, CardFactory } = require('botbuilder');

class TeamsBot extends ActivityHandler {
    constructor() {
        super();

        this.onMessage(async (context, next) => {

            const card = {
                type: "AdaptiveCard",
                version: "1.4",
                body: [
                    {
                        type: "TextBlock",
                        text: "Click to crop image"
                    }
                ],
                actions: [
                    {
                        type: "Action.Submit",
                        title: "Open Crop Tool",
                        data: {
                            msteams: {
                                type: "task/fetch"
                            }
                        }
                    }
                ]
            };

            await context.sendActivity({
                attachments: [CardFactory.adaptiveCard(card)]
            });

            await next();
        });
    }

    // ✅ Task Module open
    async handleTeamsTaskModuleFetch(context, request) {
        return {
            task: {
                type: "continue",
                value: {
                    title: "Crop Image",
                    url: `https://${process.env.NGROK_URL}/microsoft/api/messages/crop.html`,
                    height: 600,
                    width: 600
                }
            }
        };
    }

    // ✅ Receive cropped image
    async handleTeamsTaskModuleSubmit(context, request) {
        const image = request.data?.image;

        if (image) {
            await context.sendActivity({
                text: "Cropped image:",
                attachments: [{
                    contentType: "image/png",
                    contentUrl: image
                }]
            });
        }

        return {};
    }
}

module.exports.TeamsBot = TeamsBot;