const intents = require('../data/intents.json');

function normalize(text) {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

function tokenize(text) {
  return text.split(' ').filter(Boolean);
}

function matchIntent(text) {
  const normalizedText = normalize(text);
  const textTokens = new Set(tokenize(normalizedText));

  let bestMatch = null;
  let bestScore = 0;

  for (const [intent, keywords] of Object.entries(intents)) {
    for (const keyword of keywords) {
      const normalizedKeyword = normalize(keyword);

      if (normalizedText === normalizedKeyword) {
        return intent;
      }

      if (normalizedText.includes(normalizedKeyword)) {
        const score = normalizedKeyword.length * 2;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = intent;
        }
      } else {
        const keywordTokens = tokenize(normalizedKeyword);
        const matchCount = keywordTokens.filter((t) => textTokens.has(t)).length;
        if (matchCount > 0 && matchCount === keywordTokens.length) {
          if (matchCount > bestScore) {
            bestScore = matchCount;
            bestMatch = intent;
          }
        }
      }
    }
  }

  return bestMatch;
}

module.exports = { matchIntent };