const messageRespons = require('../messageRespons');

// Use a static language for testing
const language = 'English';
const category_id = '9110911'

const responseInstruction = messageRespons(category_id, language);
console.log(responseInstruction);
console.log('-----------------------------------');