const { CardFactory } = require('botbuilder');
const { getMenuCard } = require('../cards/menuCard');

async function card(context, text, adaptiveCard) {
  await context.sendActivity({
    text,
    attachments: [CardFactory.adaptiveCard(adaptiveCard)]
  });
}

async function text(context, message) {
  await context.sendActivity({ text: message });
}

async function menu(context) {
  await card(context, 'Main Menu:', getMenuCard());
}

async function unknown(context) {
  await text(context, "I couldn't understand that.");
  await menu(context);
}

module.exports = {
  card,
  text,
  menu,
  unknown
};