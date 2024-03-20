require('dotenv').config({ path: '../.env' });
const { fetchConversationDetails, prepareMessagesForGPTPrompt, sendPromptToGPT } = require('../server');

const conversationId = '148389000138802';

async function testCategorizeConvo() {
    let fetchResult;

    // Attempt to fetch conversation details
    try {
        fetchResult = await fetchConversationDetails(conversationId);
        console.log("Succeeded fetching details");
    } catch (error) {
        console.error('Error fetching conversation details:', error);
        return; // Exit if fetching fails
    }

    let preparedMessages;

    // Prepare messages for GPT prompt if fetchResult is valid
    try {
        if (!fetchResult || !fetchResult.conversationData) {
            throw new Error('Fetched result is not in the expected format.');
        }
        preparedMessages = prepareMessagesForGPTPrompt(fetchResult.conversationData, fetchResult.language);
        console.log("Succeeded preparing prompt");
    } catch (error) {
        console.error('Error preparing messages for GPT:', error);
        return; // Exit if preparation fails
    }

    // Categorize conversation via GPT if preparedMessages is valid
    try {
        if (!preparedMessages) {
            throw new Error('Prepared messages are not defined.');
        }
        const categorizedMessages = await sendPromptToGPT(preparedMessages); // Ensure this call is awaited
        console.log("Succeeded categorizing conversation", categorizedMessages);
    } catch (error) {
        console.error('Error categorizing messages for GPT:', error);
    }
}

testCategorizeConvo();
