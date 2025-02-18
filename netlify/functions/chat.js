const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // Get API key from environment variable
  const API_KEY = process.env.GOOGLE_AI_API_KEY;

  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured' })
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const body = JSON.parse(event.body);
    const message = body.message;

    const result = await model.generateContent(message);
    const response = await result.response;
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        candidates: [{
          content: {
            parts: [{
              text: response.text()
            }]
          }
        }]
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
}; 