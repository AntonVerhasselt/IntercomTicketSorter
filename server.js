require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const INTERCOM_ACCESS_TOKEN = process.env.INTERCOM_ACCESS_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const generateCategoryPromptMessageContent = require('./categoryPromptMessage');

// Middleware
app.use(bodyParser.json());

// Function to strip HTML tags from strings, handling null or undefined inputs
function stripHtml(html) {
    if (!html) return "";
    return html.replace(/<\/?[^>]+(>|$)/g, "");
}

// Helper function to fetch conversation details from Intercom using Axios
const fetchConversationDetails = async (conversationId) => {
    const url = `https://api.intercom.io/conversations/${conversationId}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${INTERCOM_ACCESS_TOKEN}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const language = response.data.custom_attributes.Language;

        console.log("Succeeded fetching details");

        return { conversationData: response.data, language };
    } catch (error) {
        console.error('FetchConversationDetails Error:', error.message);
        if (error.response) {
            console.error(`Status: ${error.response.status}, Data:`, error.response.data);
        } else if (error.request) {
            console.error('No response received for request.');
        }
        return null;
    }
};

// Prepare messages for GPT prompt, stripping HTML from message content and checking for null body
const prepareMessagesForGPTPrompt = (conversationData, language) => {
    const systemMessageContent = generateCategoryPromptMessageContent(language);
    const messages = [{
        role: "system",
        content: systemMessageContent
    }];

    // Iterate over all conversation parts
    conversationData.conversation_parts.conversation_parts
        .filter(part => part.body !== null && part.body !== undefined) // Ensure there's content
        .forEach(part => {
            const role = (part.author && part.author.type === 'admin') ? 'assistant' : 'user';
            const content = stripHtml(part.body);

            messages.push({ role, content });
        });

    console.log("Prepared messages for GPT:", messages);
    return messages;
};


// Send prompt to GPT API
const sendPromptToGPT = async (messages) => {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: messages,
            temperature: 0.2,
            response_format: { "type": "json_object" },
            seed: 12345,
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        // Assuming response.data.choices[0].message.content is a valid JSON string
        if (response.data.choices && response.data.choices.length > 0 && response.data.choices[0].message) {
            // Parse the JSON string into an object
            const jsonResponse = JSON.parse(response.data.choices[0].message.content);
            console.log("Parsed GPT JSON response:", jsonResponse);

        } else {
            console.log("No choices available in response.");
        }

        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response from GPT:', error.response.data);
        } else {
            console.error('Error sending prompt to GPT:', error.message);
        }
        return null;
    }
};

// Route for receiving webhooks
app.post('/webhook', (req, res) => {
    console.log('Received webhook:', req.body);

    if (req.body.topic === 'conversation.user.created' || req.body.topic === 'conversation.user.replied') {
        const conversationId = req.body.data.item.id;
        
        fetchConversationDetails(conversationId)
            .then(({conversationData, language}) => {
                const messages = prepareMessagesForGPTPrompt(conversationData, language);
                sendPromptToGPT(messages)
                    .then(gptResponse => {
                        console.log('GPT response:', gptResponse);
                    });
            });
    }

    res.status(200).send('Webhook received');
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = { fetchConversationDetails, prepareMessagesForGPTPrompt, sendPromptToGPT };

