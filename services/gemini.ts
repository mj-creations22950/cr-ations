
import { GoogleGenAI, Type } from "@google/genai";

// Function to extract service details from natural language text using Gemini.
export async function extractServiceInfoFromText(text: string) {
  // Always initialize right before use to ensure the latest configuration/key is used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Extrait les informations suivantes de ce texte de prestation : "${text}"`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            basePrice: { type: Type.NUMBER },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  price: { type: Type.NUMBER }
                }
              }
            }
          },
          required: ['name', 'basePrice']
        }
      }
    });

    // Extract the text content from the response safely.
    const jsonStr = response.text?.trim();
    if (!jsonStr) {
      return null;
    }
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
}
