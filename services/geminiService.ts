import { GoogleGenAI, Type } from "@google/genai";
import type { Flashcard, QuizQuestion } from '../types';

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

const quizSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.STRING,
        description: "The quiz question.",
      },
      options: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: "An array of 4 multiple-choice options.",
      },
      correctAnswer: {
        type: Type.STRING,
        description: "The correct answer, which must be one of the provided options.",
      },
    },
    required: ["question", "options", "correctAnswer"],
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

export const generateSummary = async (notes: string): Promise<string> => {
  try {
    const prompt = `You are a helpful study assistant. Summarize the following notes clearly and concisely, focusing on the key concepts and takeaways. Format the output using markdown for readability (e.g., headings, bullet points).

    Notes:
    ---
    ${notes}
    ---
    
    Provide the summary as a single block of text.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating summary with Gemini:", error);
    throw new Error("Failed to communicate with Gemini API for summary.");
  }
};

export const generateQuiz = async (notes: string): Promise<QuizQuestion[]> => {
    try {
    const prompt = `You are a helpful study assistant. Based on the following notes, generate a multiple-choice quiz with 4 options per question. The quiz should test understanding of the key concepts in the notes.

    Notes:
    ---
    ${notes}
    ---

    Generate the quiz based on the provided schema. Ensure the 'correctAnswer' is always one of the strings from the 'options' array.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedData = JSON.parse(jsonString) as QuizQuestion[];
    return parsedData;

  } catch (error) {
    console.error("Error generating quiz with Gemini:", error);
    throw new Error("Failed to communicate with Gemini API for quiz.");
  }
};
