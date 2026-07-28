function getAboutCard() {
    return {
        type: "AdaptiveCard",
        version: "1.4",
        body: [
            {
                type: "TextBlock",
                text: "👤 About Me",
                weight: "Bolder",
                size: "Medium"
            },
            {
                type: "TextBlock",
                text: "Namaste! Main Harsh Gohil hoon, ek passionate Full Stack Developer jo AI, Web3 aur Cloud Technologies ke saath kaam karta hai.",
                wrap: true,
                spacing: "Small"
            },
            {
                type: "FactSet",
                facts: [
                    { title: "Experience:", value: "5+ years" },
                    { title: "Specialization:", value: "Full Stack & AI" },
                    { title: "Company:", value: "Alembic Digilabs" },
                    { title: "Location:", value: "India" }
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

module.exports = { getAboutCard };
