function getProjectsCard() {
    return {
        type: "AdaptiveCard",
        version: "1.4",
        body: [
            {
                type: "TextBlock",
                text: "My Projects",
                weight: "Bolder",
                size: "Medium"
            },
            {
                type: "TextBlock",
                text: "I have built and delivered multiple projects across domains:",
                wrap: true,
                spacing: "Small"
            },
            {
                type: "TextBlock",
                text: "• Microsoft Teams Bots\n• AI Chatbots\n• Backend Engineer Web Applications\n• WhatsApp Automation\n• Enterprise Solutions\n• Custom CRM & ERP Systems",
                wrap: true,
                spacing: "Small"
            },
            {
                type: "ActionSet",
                actions: [
                    {
                        type: "Action.OpenUrl",
                        title: "Visit Website",
                        url: "https://micro-soft-bot-port-folio.vercel.app"
                    }
                ]
            }
        ],
        actions: [
            {
                type: "Action.Submit",
                title: "Back to Menu",
                data: { type: "menu", value: "menu" }
            }
        ],
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json"
    };
}

module.exports = { getProjectsCard };
