require("dotenv").config();

const express = require("express");
const path = require("path");

const {
    CloudAdapter,
    ConfigurationBotFrameworkAuthentication
} = require("botbuilder");

const { TeamsBot } = require("./bot");

const app = express();

app.use(express.json());

// Serve static files
app.use(
    "/microsoft/api/messages",
    express.static(path.join(__dirname, "public"))
);

app.use(
    "/microsoft/api/messages/files",
    express.static(path.join(__dirname, "files"))
);

const {
    MicrosoftAppId,
    MicrosoftAppPassword,
    MicrosoftAppTenantId,
    PORT,
    NGROK_URL
} = process.env;

if (!MicrosoftAppId) {
    throw new Error("MicrosoftAppId missing");
}

if (!MicrosoftAppPassword) {
    throw new Error("MicrosoftAppPassword missing");
}

if (!MicrosoftAppTenantId) {
    throw new Error("MicrosoftTenantId missing");
}

console.log("======================================");
console.log("Bot Configuration");
console.log("======================================");
console.log("App ID      :", MicrosoftAppId);
console.log("Tenant ID   :", MicrosoftAppTenantId);
console.log("Port        :", PORT || 14000);
console.log(
    "Endpoint    :",
    `https://${NGROK_URL}/microsoft/api/messages`
);
console.log("======================================");

// Required by CloudAdapter
process.env.MicrosoftAppType = "SingleTenant";

const botFrameworkAuthentication =
    new ConfigurationBotFrameworkAuthentication(process.env);

const adapter = new CloudAdapter(botFrameworkAuthentication);

adapter.onTurnError = async (context, error) => {
    console.error("======================================");
    console.error("BOT ERROR");
    console.error(error);
    console.error("======================================");

    try {
        await context.sendActivity("An unexpected error occurred.");
    } catch (e) {
        console.error(e);
    }
};

const bot = new TeamsBot();

app.post("/microsoft/api/messages", async (req, res) => {

    console.log("--------------------------------------");
    console.log("Incoming Request");
    console.log("Channel     :", req.body.channelId);
    console.log("Service URL :", req.body.serviceUrl);
    console.log("Conversation:", req.body.conversation?.id);
    console.log("Auth Header :", req.headers.authorization ? "Present" : "Missing");
    console.log("--------------------------------------");

    await adapter.process(req, res, async (context) => {
        console.log("Bot Turn Started");
        await bot.run(context);
    });
});

app.listen(PORT || 14000, () => {
    console.log(`✅ Server running on port ${PORT || 14000}`);
});