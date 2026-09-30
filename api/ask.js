const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { question } = req.body || {};

    if (!question) {
      return res.status(400).json({
        error: "Question is required"
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: question
    });

    return res.status(200).json({
      answer: response.text
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Gemini is temporarily unavailable. Please try again."
    });
  }
};
