function getWelcomeCard() {
    return {
        type: "AdaptiveCard",
        version: "1.4",
        body: [
            {
                type: "Image",
                url: "https://alembicdigilabs.in/icon.png",
                size: "Small",
                style: "Person",
                horizontalAlignment: "Center"
            },
            {
                type: "TextBlock",
                text: "👋 Namaste! Main Harsh ka bot hoon",
                weight: "Bolder",
                size: "Large",
                horizontalAlignment: "Center"
            },
            {
                type: "TextBlock",
                text: "Full Stack Developer | AI Enthusiast | Tech Innovator",
                size: "Small",
                horizontalAlignment: "Center",
                isSubtle: true,
                wrap: true
            },
            {
                type: "TextBlock",
                text: "Niche se koi option choose karein ya apna sawal bhejein!",
                wrap: true,
                horizontalAlignment: "Center",
                spacing: "Small"
            }
        ],
        actions: [
            {
                type: "Action.Submit",
                title: "👤 About Me",
                data: { type: "menu", value: "about" }
            },
            {
                type: "Action.Submit",
                title: "💼 My Projects",
                data: { type: "menu", value: "projects" }
            },
            {
                type: "Action.Submit",
                title: "🛠️ Services",
                data: { type: "menu", value: "services" }
            },
            {
                type: "Action.Submit",
                title: "📞 Contact Me",
                data: { type: "menu", value: "contact" }
            }
        ],
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json"
    };
}

module.exports = { getWelcomeCard };
