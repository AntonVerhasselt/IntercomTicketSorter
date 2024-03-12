require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const INTERCOM_ACCESS_TOKEN = process.env.INTERCOM_ACCESS_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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

        return { conversationData: response.data, language };
    } catch (error) {
        console.error('Error fetching conversation details:', error.message);
        return null;
    }
};

// Prepare messages for GPT prompt, stripping HTML from message content and checking for null body
const prepareMessagesForGPTPrompt = (conversationData, language) => {
    const messages = conversationData.conversation_parts.conversation_parts
        .filter(part => part.body !== null && part.body !== undefined)
        .map(part => ({
            role: part.author.type === 'admin' ? 'assistant' : 'user',
            content: stripHtml(part.body)
        }));

    // Add system message at the beginning
    messages.unshift({
        role: "system",
        content: `The messages are in ${language}. Based on the context of the entire conversation, categorize the last user message. If a message could fit more than one category, choose the most likely category based on the context. If it's too ambiguous, indicate the ambiguity in your response. Output should be in English and formatted as a JSON object with 'category' and 'confidence' fields. In cases of ambiguity, include an 'ambiguous' field with value true and list the potential categories. Example of expected output for a clear case: {'category': 'Technical Support', 'confidence': 0.9}. Example for an ambiguous case: {'category': '', 'confidence': 0, 'ambiguous': true, 'potential_categories': ['Billing Issues', 'General Inquiry']}. Categories: Billing Issues (payment or subscription queries), Technical Support (product functionality issues), General Inquiry (broad, general questions), Feedback (suggestions or comments about the service).`
    });

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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
