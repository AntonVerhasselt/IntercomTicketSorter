const { generateResponsInstruction } = require('./categoryPrompts');

function messageRespons(categoryId, language) {
    try {
        const responseInstruction = generateResponsInstruction(language, categoryId);
        console.log(responseInstruction);
    } catch (error) {
        console.error("Error in messageRespons:", error);
    }
}

module.exports = messageRespons;
