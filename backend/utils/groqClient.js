const axios = require("axios");
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const groq = axios.create({
  baseURL: "https://api.groq.com/openai/v1/chat/completions",
  headers: {
    "Authorization": `Bearer ${GROQ_API_KEY}`,
    "Content-Type": "application/json"
  }
});

async function generateRoadmap(messages, model = "llama-3.3-70b-versatile") {
  try {
    const response = await groq.post("", {
      model,
      messages,
      temperature: 0.7
    });
    return response.data.choices[0].message.content;
  } catch (err) {
    console.error("Groq Error:", err.response?.data || err.message);
    throw new Error("Groq API failed");
  }
}

module.exports = { generateRoadmap };
