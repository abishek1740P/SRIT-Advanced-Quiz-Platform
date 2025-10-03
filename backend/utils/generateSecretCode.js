const Quiz = require("../models/Quiz");

exports.generateSecretCode = async () => {
  let code;
  let isUnique = false;

  while (!isUnique) {
    code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const existingQuiz = await Quiz.findOne({ secretCode: code });
    if (!existingQuiz) {
      isUnique = true;
    }
  }

  return code;
};
