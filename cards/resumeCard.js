function getResumeCard() {
    const baseUrl = process.env.NGROK_URL || "alembicdigilabs.in";
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
                text: "You can download my resume and cover letter using the buttons below.",
                wrap: true,
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
