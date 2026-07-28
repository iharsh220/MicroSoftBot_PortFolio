require('dotenv').config();
const express = require('express');
const path = require('path');
const { BotFrameworkAdapter } = require('botbuilder');
const { TeamsBot } = require('./bot');

const app = express();
app.use(express.json());

// serve HTML
app.use('/microsoft/api/messages', express.static(path.join(__dirname, 'public')));

const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

adapter.onTurnError = async (context, error) => {
    console.error(error);
    await context.sendActivity("Error occurred!");
};

const bot = new TeamsBot();

// ✅ Custom route here
app.post('/microsoft/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        await bot.run(context);
    });
});

app.listen(14000, () => {
    console.log('✅ Server running on http://localhost:14000/microsoft/api/messages');
});