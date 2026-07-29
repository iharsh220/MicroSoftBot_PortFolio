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
                text: "• Multi-Platform Chatbot with Qlik Sense Integration\n• Video Framer (FFMPEG-based promotional video generator)\n• Multiplex Video Streaming Platform (OTT with Bunny API)\n• Employee Dashboard (ReactJS · Node.js · MySQL)\n• Resync – Medical Education Platform\n• Qlik Sense Annotation Extension\n• Log Cluster – Log Visualisation Tool\n• Tableau-to-Power BI Migration Tool\n• DataAccessAuditor Portal\n• SaaS License Management System\n• Wowizer Windows Service",
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
