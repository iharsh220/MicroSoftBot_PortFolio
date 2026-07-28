function getServicesCard() {
    return {
        type: "AdaptiveCard",
        version: "1.4",
        body: [
            {
                type: "TextBlock",
                text: "Services",
                weight: "Bolder",
                size: "Medium"
            },
            {
                type: "TextBlock",
                text: "End-to-end services I offer:",
                wrap: true,
                spacing: "Small"
            },
            {
                type: "ColumnSet",
                columns: [
                    {
                        type: "Column",
                        width: "stretch",
                        items: [
                            {
                                type: "TextBlock",
                                text: "Bot Development",
                                weight: "Bolder",
                                size: "Small"
                            },
                            {
                                type: "TextBlock",
                                text: "Teams, WhatsApp, AI Chatbots",
                                size: "Small",
                                isSubtle: true
                            }
                        ]
                    },
                    {
                        type: "Column",
                        width: "stretch",
                        items: [
                            {
                                type: "TextBlock",
                                text: "Web Development",
                                weight: "Bolder",
                                size: "Small"
                            },
                            {
                                type: "TextBlock",
                                text: "React, Node.js, Backend Engineer",
                                size: "Small",
                                isSubtle: true
                            }
                        ]
                    }
                ]
            },
            {
                type: "ColumnSet",
                columns: [
                    {
                        type: "Column",
                        width: "stretch",
                        items: [
                            {
                                type: "TextBlock",
                                text: "Cloud & DevOps",
                                weight: "Bolder",
                                size: "Small"
                            },
                            {
                                type: "TextBlock",
                                text: "AWS, Azure, CI/CD",
                                size: "Small",
                                isSubtle: true
                            }
                        ]
                    },
                    {
                        type: "Column",
                        width: "stretch",
                        items: [
                            {
                                type: "TextBlock",
                                text: "AI & Automation",
                                weight: "Bolder",
                                size: "Small"
                            },
                            {
                                type: "TextBlock",
                                text: "LLM, RAG, Custom AI",
                                size: "Small",
                                isSubtle: true
                            }
                        ]
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

module.exports = { getServicesCard };
