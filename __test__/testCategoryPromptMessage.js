const generateCategoryPromptMessageContent = require('../categoryPromptMessage');

// Use a static language for testing
const language = 'English';

const message = generateCategoryPromptMessageContent(language);
console.log(message);
console.log('-----------------------------------');
