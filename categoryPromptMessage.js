const categories = [
    {
        "type": "tag",
        "id": "9110875",
        "name": "Missed sales",
        "explanation": "The user is asking about a transaction that wasn't tracked by the webshop or the affiliate platform. Because of that the user didn't receive his proper commission. The user wants retribution for this loss."
    },
    {
        "type": "tag",
        "id": "9110911",
        "name": "Payouts",
        "explanation": "The user is asking about when his organization is going to receive their commission/payout on their bank account. The timing and way of how the payouts work is unclear for this user."
    },
    {
        "type": "tag",
        "id": "9110914",
        "name": "Promo material request",
        "explanation": "The user is asking for promotional material or marketing material like flyers, poster or other print promo material. The user wants to order these or get them for free."
    },
    {
        "type": "tag",
        "id": "9110915",
        "name": "Login",
        "explanation": "The user is asking about login issues."
    }
];

function generateCategoryPromptMessageContent(language) {
    // Dynamically create the categories description part of the message
    const categoriesDescriptions = categories.map(category => `${category.name} (id = ${category.id}): ${category.explanation}`).join(', ');

    return `These messages are in ${language}. Based on the context of the entire conversation, categorize the last user message. If a message could fit more than one category, choose the most likely category based on the context. If it's too ambiguous, indicate the ambiguity in your response. Output should be formatted as a JSON object with 'category_name', 'category_id' and 'confidence_score' fields. In cases of ambiguity, include an 'ambiguous' field with value true. Example of expected output for a clear case: {'category_name': 'Missed sales', 'category_id': '9110875', 'confidence_score': 0.9}. Example for an ambiguous case: {'category_name': '', 'category_id': '' 'confidence_score': 0, 'ambiguous': true, 'potential_categories': ['Missed sales', 'Payouts']}. Here you have our list of categories, the category id's and their explanations: ${categoriesDescriptions}.`;
}

module.exports = generateCategoryPromptMessageContent;
