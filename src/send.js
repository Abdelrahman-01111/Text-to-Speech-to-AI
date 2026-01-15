import { GoogleGenAI } from "@google/genai";
export default async function sendTranscript(transcript) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: transcript,
  });

  return response.text;
}
