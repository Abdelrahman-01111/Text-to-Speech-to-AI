// api/gemini.js
import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY; //changed api key
  const ai = new GoogleGenAI({
    apiKey: apiKey,
  });

  // 1. Security Check: Ensure only POST requests are allowed
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Use POST." });
  }

  // 2. Get the API Key safely from the environment

  if (!apiKey) {
    return res.status(500).json({ error: "API Key is missing on the server." });
  }

  try {
    // 3. Extract the user's prompt from the request body
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Please provide a prompt." });
    }

    // 4. Initialize Gemini
    const AIresponse = await ai.models.generateContent({
      model: "gemini-3-flash",
      contents: prompt,
    });
    // 5. Call the API
    const text = await AIresponse.text();

    // 6. Return the result to your frontend
    return res.status(200).json({ answer: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
}
