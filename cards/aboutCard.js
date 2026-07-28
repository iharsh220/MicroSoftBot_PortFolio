function getAboutCard() {
    const baseUrl = process.env.NGROK_URL || "micro-soft-bot-port-folio.vercel.app";
    return {
        type: "AdaptiveCard",
        version: "1.4",
        body: [
            {
                type: "TextBlock",
                text: "About Me",
                weight: "Bolder",
                size: "Medium"
            },
            {
                type: "TextBlock",
                text: "Hi, I am Harsh Gohil — a passionate Backend Engineer specializing in Nodejs, AI, Web3, and Cloud Technologies. I build innovative solutions that help businesses grow.",
                wrap: true,
                spacing: "Small"
            },
            {
                type: "FactSet",
                facts: [
                    { title: "Experience:", value: "8+ years" },
                    { title: "Specialization:", value: "Full Stack & AI" },
                    { title: "Company:", value: "Alembic Digilabs" },
                    { title: "Location:", value: "India" }
                ]
            }
        ],
        actions: [
            {
                type: "Action.OpenUrl",
                title: "Download Resume",
                url: `https://${baseUrl}/microsoft/api/messages/files/resume/Harsh_Gohil_Backend_Enginner_.pdf`
            },
            {
                type: "Action.OpenUrl",
                title: "Download Cover Letter",
                url: `https://${baseUrl}/microsoft/api/messages/files/resume/Harsh_Gohil_Cover_Letter.pdf`
            },
            {
                type: "Action.Submit",
                title: "Back to Menu",
                data: { type: "menu", value: "menu" }
            }
        ],
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json"
    };
}

module.exports = { getAboutCard };
