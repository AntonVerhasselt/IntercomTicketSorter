const { generateCategorizeInstruction, generateResponsInstruction } = require('../categoryPrompts');

// Use a static language for testing
const language = 'English';
const category_id = '9110911'

const categorizeMessage = generateCategorizeInstruction(language);
console.log(categorizeMessage);
console.log('-----------------------------------');

const responsMessage = generateResponsInstruction(language, category_id);
console.log(responsMessage);
console.log('-----------------------------------');

