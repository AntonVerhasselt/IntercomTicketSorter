const categories = [
    {
        "type": "tag",
        "id": "9110875",
        "name": "Missed sales",
        "explanation": "The user is asking about a transaction that wasn't tracked by the webshop or the affiliate platform. Because of that the user didn't receive his proper commission. The user wants retribution for this loss.",
        "respons": "TO DO"
    },
    {
        "type": "tag",
        "id": "9110911",
        "name": "Payouts",
        "explanation": "The user is asking about when his organization is going to receive their commission/payout on their bank account. The timing and way of how the payouts work is unclear for this user.",
        "respons": `Commission statuses include "Rejected" for returned or canceled goods, "Under Review" during the return period pending product return confirmation, and "Approved" for approved but unpaid commissions by the webshop. Yellow bars on the dashboard indicate commissions paid by the webshop and ready to be forwarded. A minimum of €75 must be available for payout, from which a one-time start-up fee of €75 is deducted. Payouts occur when the balance exceeds €75 to minimize administrative efforts, scheduled quarterly in January, April, July, and October, around the 21st. Upon payment, an email is sent, and an invoice is posted on the dashboard under "Invoicing."`
    },
    {
        "type": "tag",
        "id": "9110914",
        "name": "Promo material request",
        "explanation": "The user is asking for promotional material or marketing material like flyers, poster or other print promo material. The user wants to order these or get them for free.",
        "respons": "TO DO"
    },
    {
        "type": "tag",
        "id": "9110915",
        "name": "Login",
        "explanation": "The user is asking about login issues.",
        "respons": "TO DO"
    }
];

function generateCategorizeInstruction(language) {
    // Dynamically create the categories description part of the message
    const categoriesDescriptions = categories.map(category => `${category.name} (id = ${category.id}): ${category.explanation}`).join(', ');

    return `These messages are in ${language}. Based on the context of the entire conversation, categorize the last user message. If a message could fit more than one category, choose the most likely category based on the context. If it's too ambiguous, indicate the ambiguity in your response. Output should be formatted as a JSON object with 'category_name', 'category_id' and 'confidence_score' fields. In cases of ambiguity, include an 'ambiguous' field with value true. Example of expected output for a clear case: {'category_name': 'Missed sales', 'category_id': '9110875', 'confidence_score': 0.9}. Example for an ambiguous case: {'category_name': '', 'category_id': '' 'confidence_score': 0, 'ambiguous': true, 'potential_categories': ['Missed sales', 'Payouts']}. Here you have our list of categories, the category id's and their explanations: ${categoriesDescriptions}.`;
}

function generateResponsInstruction(language, category_id) {
    // Find the category in the categories array that matches the given category_id
    const category = categories.find(c => c.id === category_id);

    // If the category is found, format the response instruction with the language and explanation
    if (category) {
        return `These messages are in ${language}. Write a response for these messages in ${language} and use as mutch context of the conversation as possible. The content of your message should be the following: ${category.respons}`;
    } else {
        // If no matching category is found, return a message indicating that the category_id is invalid
        return `The provided category_id (${category_id}) is invalid. Please provide a valid category_id.`;
    }
}

module.exports = { generateCategorizeInstruction, generateResponsInstruction };

