
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function breakdownTask(taskDescription: string): Promise<string[]> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Break down the following task into 3-5 simple, actionable sub-steps: "${taskDescription}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'A list of actionable sub-tasks'
            }
          },
          required: ['steps']
        }
      }
    });

    const data = JSON.parse(response.text || '{"steps": []}');
    return data.steps;
  } catch (error) {
    console.error("Error breaking down task:", error);
    return [];
  }
}
