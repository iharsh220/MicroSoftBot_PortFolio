function getProjectsCard() {
    return {
        type: "AdaptiveCard",
        version: "1.4",
        body: [
            {
                type: "TextBlock",
                text: "💼 My Projects",
                weight: "Bolder",
                size: "Medium"
            },
            {
                type: "TextBlock",
                text: "Main ne kai projects banaye hain:",
                wrap: true,
                spacing: "Small"
            },
            {
                type: "TextBlock",
                text: "✅ Microsoft Teams Bots\n✅ AI Chatbots\n✅ Full Stack Web Apps\n✅ WhatsApp Automation\n✅ Enterprise Solutions\n✅ Custom CRM & ERPs",
                wrap: true,
                spacing: "Small"
            },
            {
                type: "ActionSet",
                actions: [
                    {
                        type: "Action.OpenUrl",
                        title: "🌐 Visit Website",
                        url: "https://alembicdigilabs.in"
                    }
                ]
            }
        ],
        actions: [
            {
                type: "Action.Submit",
                title: "⬅️ Back to Menu",
                data: { type: "menu", value: "menu" }
            }
        ],
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json"
    };
}

module.exports = { getProjectsCard };
