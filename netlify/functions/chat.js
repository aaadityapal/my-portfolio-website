exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    const message = body.message;

    // Here you can add your chatbot logic
    // For now, let's just echo back a simple response
    const response = {
      candidates: [{
        content: {
          parts: [{
            text: `You said: ${message}. This is a test response from the chatbot.`
          }]
        }
      }]
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(response)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
}; 