function getWelcomeCard() {
    const baseUrl = process.env.NGROK_URL || "micro-soft-bot-port-folio.vercel.app";
    return {
        type: "AdaptiveCard",
        version: "1.4",
        body: [
            {
                type: "Image",
                url: "https://micro-soft-bot-port-folio.vercel.app/icon.png",
                size: "Small",
                style: "Person",
                horizontalAlignment: "Center"
            },
            {
                type: "TextBlock",
                text: "Harsh Gohil",
                weight: "Bolder",
                size: "Large",
                horizontalAlignment: "Center"
            },
            {
                type: "TextBlock",
                text: "Senior Backend Developer & Full Stack Engineer",
                size: "Small",
                horizontalAlignment: "Center",
                isSubtle: true,
                wrap: true
            },
            {
                type: "TextBlock",
                text: "Hi, I am Harsh Gohil. How can I help you today?",
                wrap: true,
                horizontalAlignment: "Center",
                spacing: "Small"
            }
        ],
        actions: [
            {
                type: "Action.OpenUrl",
                title: "Download Resume",
                url: `https://${baseUrl}/microsoft/api/messages/files/resume/Harsh_Gohil_Backend_Enginner_.pdf`
            },
            {
                type: "Action.Submit",
                title: "About Me",
                data: { type: "menu", value: "about" }
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

module.exports = { getWelcomeCard };
