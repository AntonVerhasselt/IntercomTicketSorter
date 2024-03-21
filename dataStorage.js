const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Gets the ISO week date.
 * The ISO week starts on Monday and the first week of a year is the one that includes the first Thursday.
 * @param {Date} date - The date to get the week number for.
 * @returns {number} The ISO week number.
 */
function getISOWeekNumber(date) {
    const thursday = new Date(date.getTime());
    thursday.setDate(date.getDate() - ((date.getDay() + 6) % 7) + 3);
    const firstThursday = new Date(thursday.getFullYear(), 0, 4);
    return 1 + Math.floor((thursday - firstThursday) / (7 * 24 * 3600 * 1000));
}

/**
 * Ensures that the directory for storing the data exists.
 * @param {string} dirPath - The path of the directory to ensure.
 */
function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

/**
 * Stores the conversation data in a .jsonl file for the current week.
 * If the file for the current week does not exist, it is created.
 * @param {object} conversationData - The conversation data to store.
 * @param {string|number|Date} timestamp - The timestamp when the conversation took place.
 */
function storeData(conversationData, timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const weekNumber = getISOWeekNumber(date);
    const weekLabel = `${year}-week${String(weekNumber).padStart(2, '0')}`;
    const dirPath = path.join(__dirname, 'data');
    const filePath = path.join(dirPath, `${weekLabel}.jsonl`);

    ensureDirectoryExists(dirPath);

    const line = JSON.stringify({ messages: conversationData }) + os.EOL;

    // Append the data to the current week's file, creating the file if it does not exist.
    fs.appendFileSync(filePath, line, 'utf8');
}

module.exports = storeData;
