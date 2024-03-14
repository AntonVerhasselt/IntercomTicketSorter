// This test is failing for the moment and would continue investigating if the fetchConverstaionDetails function is working as expected

require('dotenv').config();
const { fetchConversationDetails } = require('../server');

// Use a static conversationId for testing
const conversationId = '148389000138512';

async function testFetchConversationDetails() {
    try {
        const result = await fetchConversationDetails(conversationId);
        console.log('Result:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

testFetchConversationDetails();
