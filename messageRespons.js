function messageRespons(categoryId, language) {
    try {
        console.log(`Processing category ${categoryId} for language ${language}.`);
    } catch (error) {
        console.error("Error in messageRespons:", error);
    }
}

module.exports = messageRespons;
