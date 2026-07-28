require("dotenv").config();

const { ConfidentialClientApplication } = require("@azure/msal-node");

const cca = new ConfidentialClientApplication({
    auth: {
        clientId: process.env.MicrosoftAppId,
        clientSecret: process.env.MicrosoftAppPassword,
        authority: `https://login.microsoftonline.com/${process.env.MicrosoftTenantId}`
    }
});

cca.acquireTokenByClientCredential({
    scopes: ["https://api.botframework.com/.default"]
})
    .then(result => {
        console.log("SUCCESS");
        console.log(result.accessToken.substring(0, 40));
    })
    .catch(err => {
        console.error(err);
    });