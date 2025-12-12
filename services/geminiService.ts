import { GoogleGenAI, Type, Schema } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// --- Diet Tracking Models ---

const mealSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "A short, concise name for the meal." },
    calories: { type: Type.NUMBER, description: "Estimated total calories." },
    protein: { type: Type.NUMBER, description: "Estimated protein in grams." },
    carbs: { type: Type.NUMBER, description: "Estimated carbohydrates in grams." },
    fats: { type: Type.NUMBER, description: "Estimated fats in grams." },
  },
  required: ["name", "calories", "protein", "carbs", "fats"],
};

export const analyzeMeal = async (description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the nutritional content of this meal description: "${description}". Provide a realistic estimate.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: mealSchema,
      },
    });
    
    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Error analyzing meal:", error);
    throw error;
  }
};

// --- Emotional Support Chat ---

export const getEmotionalSupportResponse = async (history: { role: string; parts: { text: string }[] }[], newMessage: string) => {
  try {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: "You are a compassionate, encouraging, and knowledgeable fat loss coach and emotional support companion. Your goal is to help the user stay motivated, navigate emotional eating triggers, and maintain a healthy mindset. Be empathetic but practical. Keep responses concise (under 3 paragraphs) unless asked for details.",
      },
      history: history
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
  } catch (error) {
    console.error("Error getting support response:", error);
    throw error;
  }
};

// --- Smart Journal (Notes Assistant) ---

const journalMetadataSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A concise title (under 10 words) for the note." },
    tags: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "A list of maximum 5 relevant keyword tags." 
    },
  },
  required: ["title", "tags"],
};

export const generateJournalMetadata = async (content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this journal entry. Generate a concise title and relevant tags.\n\nEntry: "${content}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: journalMetadataSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Error generating journal metadata:", error);
    throw error;
  }
};

export const polishJournalContent = async (content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Enhance the following text for clarity, flow, and emotional resonance. Return ONLY the polished text, no preamble.\n\nText: "${content}"`,
    });
    return response.text;
  } catch (error) {
    console.error("Error polishing content:", error);
    throw error;
  }
};