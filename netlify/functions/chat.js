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
    let message = body.message.toLowerCase();

    // Predefined behaviors
    const behaviors = {
      greetings: ['hello', 'hi', 'hey', 'greetings'],
      portfolio: ['portfolio', 'projects', 'work'],
      skills: ['skills', 'technologies', 'tech stack'],
      contact: ['contact', 'email', 'reach'],
      experience: ['experience', 'background', 'work history'],
      education: ['education', 'study', 'degree', 'qualification'],
      availability: ['available', 'hire', 'hiring', 'job']
    };

    // Check for predefined patterns
    let customResponse = '';

    if (behaviors.greetings.some(word => message.includes(word))) {
      customResponse = "Hello! I'm Aditya's AI assistant. I can help you learn more about his skills, projects, education, or how to get in touch with him. What would you like to know?";
    } else if (behaviors.portfolio.some(word => message.includes(word))) {
      customResponse = "Aditya has worked on various projects including AI integration, web development, and full-stack applications. You can check out his projects section on this website. Would you like me to tell you about any specific project?";
    } else if (behaviors.skills.some(word => message.includes(word))) {
      customResponse = "Aditya specializes in AI & Web Development with expertise in: \n• Frontend: React, JavaScript, HTML5, CSS3\n• Backend: Node.js, Python\n• AI/ML: TensorFlow, PyTorch\n• Cloud: AWS\nWhich technology would you like to know more about?";
    } else if (behaviors.contact.some(word => message.includes(word))) {
      customResponse = "You can reach out to Aditya through:\n• Email: [Your Email]\n• LinkedIn: [Your LinkedIn]\n• GitHub: [Your GitHub]\nOr you can use the contact form on this website.";
    } else if (behaviors.experience.some(word => message.includes(word))) {
      customResponse = "Aditya is an AI & Web Developer with experience in building intelligent web solutions. He specializes in AI integration and full-stack development. Would you like to know about specific projects or technologies he's worked with?";
    } else if (behaviors.education.some(word => message.includes(word))) {
      customResponse = "Aditya has completed:\n• B.Tech in Computer Science\n• Minor in Artificial Intelligence from IIT Ropar\nWould you like to know more about his academic background or technical certifications?";
    } else if (behaviors.availability.some(word => message.includes(word))) {
      customResponse = "Aditya is open to interesting project opportunities and collaborations. You can reach out through the contact section or send him a direct message on LinkedIn for professional inquiries.";
    }

    // If no predefined pattern matches, use the AI model
    if (!customResponse) {
      const result = await model.generateContent(message);
      const response = await result.response;
      customResponse = response.text();
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        candidates: [{
          content: {
            parts: [{
              text: customResponse
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