function getMenuCard() {
    return {
        type: "AdaptiveCard",
        version: "1.4",
        body: [
            {
                type: "TextBlock",
                text: "Main Menu",
                weight: "Bolder",
                size: "Medium",
                horizontalAlignment: "Center"
            }
        ],
        actions: [
            {
                type: "Action.Submit",
                title: "About Me",
                data: { type: "menu", value: "about" }
            },
            {
                type: "Action.Submit",
                title: "Resume & Cover Letter",
                data: { type: "menu", value: "resume" }
            },
            {
                type: "Action.Submit",
                title: "My Projects",
                data: { type: "menu", value: "projects" }
            },
            {
                type: "Action.Submit",
                title: "Services",
                data: { type: "menu", value: "services" }
            },
            {
                type: "Action.Submit",
                title: "Contact Me",
                data: { type: "menu", value: "contact" }
            }
        ],
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json"
    };
}

module.exports = { getMenuCard };
