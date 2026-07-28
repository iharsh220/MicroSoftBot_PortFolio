function getContactCard() {
    return {
        type: "AdaptiveCard",
        version: "1.4",
        body: [
            {
                type: "TextBlock",
                text: "📞 Contact Me",
                weight: "Bolder",
                size: "Medium"
            },
            {
                type: "FactSet",
                facts: [
                    { title: "Email:", value: "harsh@alembicdigilabs.in" },
                    { title: "Website:", value: "https://alembicdigilabs.in" },
                    { title: "LinkedIn:", value: "https://linkedin.com/in/harshgohil" },
                    { title: "GitHub:", value: "https://github.com/harshgohil" }
                ]
            },
            {
                type: "TextBlock",
                text: "Ya directly message karein! Main jald reply dunga 😊",
                wrap: true,
                spacing: "Small",
                isSubtle: true
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

module.exports = { getContactCard };
