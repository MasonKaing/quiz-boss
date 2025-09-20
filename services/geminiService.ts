
import { GoogleGenAI, Type } from "@google/genai";
import type { Flashcard } from '../types';

if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const flashcardSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.STRING,
        description: "The question, term, or concept on the front of the flashcard. This should be concise.",
      },
      answer: {
        type: Type.STRING,
        description: "The detailed answer or definition on the back of the flashcard.",
      },
    },
    required: ["question", "answer"],
  },
};

export const generateFlashcards = async (notes: string): Promise<Flashcard[]> => {
  try {
    const prompt = `You are a helpful study assistant. Based on the following notes, generate a clear and concise set of flashcards. Each flashcard should have a 'question' and a corresponding 'answer'.

    Notes:
    ---
    ${notes}
    ---

    Generate the flashcards based on the provided schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: flashcardSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedData = JSON.parse(jsonString) as Flashcard[];
    return parsedData;

  } catch (error) {
    console.error("Error generating flashcards with Gemini:", error);
    throw new Error("Failed to communicate with Gemini API.");
  }
};
