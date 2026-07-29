function getContactCard() {
    return {
        type: "AdaptiveCard",
        version: "1.4",
        body: [
            {
                type: "TextBlock",
                text: "Contact Me",
                weight: "Bolder",
                size: "Medium"
            },
            {
                type: "FactSet",
                facts: [
                    { title: "Phone:", value: "+91-8080302041" },
                    { title: "Email:", value: "iharsh220@zohomail.in" },
                    { title: "LinkedIn:", value: "linkedin.com/in/harsh-gohil-242706194" },
                    { title: "GitHub:", value: "github.com/iharsh220" },
                    { title: "Location:", value: "Mumbai, Maharashtra, India" }
                ]
            },
            {
                type: "TextBlock",
                text: "Feel free to reach out. I respond quickly.",
                wrap: true,
                spacing: "Small",
                isSubtle: true
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

module.exports = { getContactCard };
