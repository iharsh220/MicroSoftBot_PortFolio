const { projects } = require("../data/projects.json");

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
                text: projects.map((p) => `• **${p.name}** (${p.tech.split(",").slice(0, 3).map((t) => t.trim()).join(", ")})`).join("\n"),
                wrap: true,
                spacing: "Small"
            }
            // {
            //     type: "ActionSet",
            //     actions: [
            //         {
            //             type: "Action.OpenUrl",
            //             title: "Visit Website",
            //             url: "https://micro-soft-bot-port-folio.vercel.app"
            //         }
            //     ]
            // }
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
