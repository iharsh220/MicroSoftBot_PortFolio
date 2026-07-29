const { card, text } = require('../utils/reply');
const { getQuestionCard, getResultCard } = require('../cards/interviewCard');
const interviewData = require('../data/interview.json');

const sessions = new Map();

async function handleInterview(context) {
  const conversationId = context.activity.conversation.id;
  const value = context.activity.value || {};
  const text = (context.activity.text || '').trim();

  let session = sessions.get(conversationId);

  if (!session || session.completed) {
    if (value.action === 'restart') {
      sessions.delete(conversationId);
    }
    session = {
      currentIndex: 0,
      score: 0,
      answers: [],
      completed: false
    };
    sessions.set(conversationId, session);
    await showQuestion(context, session);
    return;
  }

  if (value.action === 'restart') {
    sessions.delete(conversationId);
    session = {
      currentIndex: 0,
      score: 0,
      answers: [],
      completed: false
    };
    sessions.set(conversationId, session);
    await showQuestion(context, session);
    return;
  }

  const currentQ = interviewData.questions[session.currentIndex];
  let selectedAnswer = null;

  if (value.action === 'answer' && typeof value.answer === 'number') {
    selectedAnswer = value.answer;
  } else if (text) {
    const textLower = text.toLowerCase().trim();
    selectedAnswer = currentQ.options.findIndex(
      (opt) => opt.toLowerCase() === textLower
    );
    if (selectedAnswer === -1) {
      selectedAnswer = currentQ.options.findIndex((opt) =>
        opt.toLowerCase().includes(textLower)
      );
    }
  }

  if (selectedAnswer !== null && selectedAnswer >= 0 && selectedAnswer < currentQ.options.length) {
    const isCorrect = selectedAnswer === currentQ.correct;
    session.score += isCorrect ? 1 : 0;
    session.answers.push({
      question: currentQ.question,
      correct: isCorrect
    });
  }

  session.currentIndex++;

  if (session.currentIndex >= interviewData.questions.length) {
    session.completed = true;
    await card(context, '', getResultCard(session.score, interviewData.questions.length, session.answers));
  } else {
    await showQuestion(context, session);
  }
}

async function showQuestion(context, session) {
  const q = interviewData.questions[session.currentIndex];
  await card(context, '', getQuestionCard(q.question, q.options, session.currentIndex, interviewData.questions.length));
}

module.exports = handleInterview;