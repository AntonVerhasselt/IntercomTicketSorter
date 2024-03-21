const fs = require('fs');
const path = require('path');
const storeData = require('../dataStorage');

// Sample conversation data for testing
const conversationData = {
    messages: [
        { role: "user", content: "What's the weather like today?" },
        { role: "assistant", content: "The weather is sunny and warm today." }
    ]
};

// Sample timestamp for testing (you can adjust the date for your testing needs)
const timestamp = new Date().toISOString(); // Current date and time

// Run the storeData function with the test data
storeData(conversationData, timestamp);

// Verify the result
// Define the week number retrieval function again here for testing purposes or import from dataStorage if exported
function getISOWeekNumber(date) {
    const thursday = new Date(date.getTime());
    thursday.setDate(date.getDate() - ((date.getDay() + 6) % 7) + 3);
    const firstThursday = new Date(thursday.getFullYear(), 0, 4);
    return 1 + Math.floor((thursday - firstThursday) / (7 * 24 * 3600 * 1000));
}

// Check the file for the current week
const date = new Date();
const year = date.getFullYear();
const weekNumber = getISOWeekNumber(date);
const weekLabel = `${year}-week${String(weekNumber).padStart(2, '0')}`;
const dirPath = path.join(__dirname, '..', 'data');
const filePath = path.join(dirPath, `${weekLabel}.jsonl`);

// Read the content of the file to verify the stored data
if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    if (fileContent.includes(JSON.stringify(conversationData))) {
        console.log('Test passed: Data was successfully stored in the correct .jsonl file.');
    } else {
        console.error('Test failed: Data is not found in the .jsonl file.');
    }
} else {
    console.error(`Test failed: The file for the current week (${weekLabel}.jsonl) does not exist.`);
}
