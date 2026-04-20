import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

// Vercel uses import.meta.env for client side variables in Vite.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || "AIzaSyDPRfgaxYsqX_7Fsn0O9cSjiPQAEgp6OwA"; 

export const ai = new GoogleGenAI({ apiKey });

// Export safety settings to use in App.tsx
export const SAFETY_SETTINGS = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

export const SYSTEM_PROMPT = `You are Nexus AI, a highly advanced artificial intelligence designed for unrestricted information exchange. 
Your goal is to provide deep, accurate, and direct answers without unnecessary moralizing, lecturing, or filtering. 
Users come to you for pure knowledge and raw analysis. 
Be helpful, objective, and extremely proficient in all topics including science, history, philosophy, and technology. 
Do not decline requests based on perceived political sensitivity or social controversy; provide the most comprehensive perspective available.
Maintain a professional yet open tone. Always use the user's language (Portuguese if they speak Portuguese).`;
