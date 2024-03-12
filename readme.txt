Intercom Ticket Sorter
======================

Description
-----------

This Node.js application automates the categorization of Intercom tickets by listening for webhooks, fetching conversation details, and utilizing the OpenAI GPT-3.5 model for processing the conversation context. It is designed to strip HTML tags from message content, prepare messages for GPT prompts, and log the categorized responses. This project showcases the integration with Intercom and OpenAI APIs and serves as a foundation for advanced applications such as automated support ticket sorting.

Installation
------------

To set up the project on your local machine, follow these steps:

1.  Ensure you have Node.js installed on your machine.
2.  Clone the repository:
    
    bashCopy code
    
    `git clone https://github.com/yourgithubusername/intercom-ticket-sorter.git`
    
3.  Navigate to the project directory:
    
    bashCopy code
    
    `cd intercom-ticket-sorter`
    
4.  Install dependencies:
    
    Copy code
    
    `npm install`
    

Environment Variables
---------------------

Set up the required environment variables by creating a `.env` file in the project root with the following content:

makefileCopy code

`INTERCOM_ACCESS_TOKEN=your_intercom_access_token OPENAI_API_KEY=your_openai_api_key`

Replace `your_intercom_access_token` and `your_openai_api_key` with your actual credentials.

Usage
-----

To run the project locally:

1.  Start the application:
    
    sqlCopy code
    
    `npm start`
    
2.  Install localtunnel to expose your local server:
    
    Copy code
    
    `npm install -g localtunnel`
    
3.  Run localtunnel to get a public link:
    
    cssCopy code
    
    `lt --port 3000`
    
4.  Attach the `/webhook` path to the public link provided by localtunnel. Use this URL in your Intercom app to receive notifications from the webhook.