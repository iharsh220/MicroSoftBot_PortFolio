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
                text: "Results-driven Senior Backend Developer with 8+ years of experience designing and delivering scalable, enterprise-grade SaaS products across the pharmaceutical, analytics, and media industries. Proven track record of architecting end-to-end solutions — from API design and database modeling to cloud deployment — both as a team lead and independently.",
                wrap: true,
                spacing: "Small"
            },
            {
                type: "FactSet",
                facts: [
                    { title: "Experience:", value: "8+ years" },
                    { title: "Specialization:", value: "Backend Developer & Full Stack Engineer" },
                    { title: "Current Company:", value: "Alembic Pharmaceuticals" },
                    { title: "Location:", value: "Mumbai, Maharashtra, India" }
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
