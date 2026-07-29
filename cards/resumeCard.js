function getResumeCard() {
    const baseUrl = process.env.NGROK_URL || "micro-soft-bot-port-folio.vercel.app";
    return {
        type: "AdaptiveCard",
        version: "1.4",
        body: [
            {
                type: "TextBlock",
                text: "Resume & Cover Letter",
                weight: "Bolder",
                size: "Medium"
            },
            {
                type: "TextBlock",
                text: "Harsh Gohil — Senior Backend Developer & Full Stack Engineer",
                wrap: true,
                spacing: "Small"
            },
            {
                type: "TextBlock",
                text: "8+ years of experience in backend and full stack development.",
                wrap: true,
                spacing: "Small",
                isSubtle: true
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

module.exports = { getResumeCard };
