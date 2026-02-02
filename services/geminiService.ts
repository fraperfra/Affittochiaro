import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client using the required named parameter and environment variable directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTenantPitch = async (userData: {
  name: string;
  job: string;
  reason: string;
  hobbies: string;
}) => {
  try {
    // Use the model and prompt together in the generateContent call as per SDK guidelines.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Aiutami a scrivere un pitch di presentazione accattivante per un proprietario di casa. Mi chiamo ${userData.name}, lavoro come ${userData.job}. Cerco casa perché ${userData.reason}. Nel tempo libero mi piace ${userData.hobbies}. Il tono deve essere professionale, affidabile ma caloroso. Massimo 3 frasi.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });

    // Directly access the .text property of the GenerateContentResponse object.
    return response.text;
  } catch (error) {
    console.error("Error generating pitch:", error);
    return "Ciao, sono un inquilino affidabile e interessato al tuo immobile. Sarei felice di conoscerci per una visita.";
  }
};