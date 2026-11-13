require("dotenv").config();

const express = require("express");
const path = require("path");

const {
    CloudAdapter,
    ConfigurationBotFrameworkAuthentication
} = require("botbuilder");

const { TeamsBot } = require("./bot");

const app = express();

app.use(express.json({ limit: "20kb" }));

// ---- Portfolio web chat (public/chat → /microsoft/api/messages/chat/) ----
const { respond } = require("./services/webChat");

// Tiny in-memory limiter: 40 messages / minute / IP
const chatHits = new Map();
setInterval(() => chatHits.clear(), 60 * 1000).unref();

app.post("/microsoft/api/messages/chat/api", async (req, res) => {
    const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.socket.remoteAddress;
    const hits = (chatHits.get(ip) || 0) + 1;
    chatHits.set(ip, hits);
    if (hits > 40) {
        return res.status(429).json({ messages: [{ type: "text", text: "You're typing faster than I can think. Try again in a minute." }] });
    }

    try {
        const { text, action } = req.body || {};
        res.setHeader("Cache-Control", "no-store");
        res.json(await respond({ text, action }));
    } catch (err) {
        console.error("Web chat error:", err);
        res.status(500).json({ messages: [{ type: "text", text: "Something went wrong on my side. Please try again." }] });
    }
});

// Data Access Auditor Windows app (named download, correct filename)
app.get("/microsoft/api/messages/download/data-access-auditor", (req, res) => {
    res.download(
        path.join(__dirname, "public/assets/executive/Windows_Executive_Data_Access_Auditor/DataAccessAuditor.exe"),
        "DataAccessAuditor.exe"
    );
});

// Demo videos: long cache + byte-range streaming (express.static supports Range)
app.use(
    "/microsoft/api/messages/demos",
    express.static(path.join(__dirname, "public/demos"), { maxAge: "30d", immutable: true })
);

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