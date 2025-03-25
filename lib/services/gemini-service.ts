"use client";

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Safety settings configuration
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Generation configuration
const generationConfig = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 1024,
};

// Initialize with API key or use environment variable
let apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
let genAI: GoogleGenerativeAI | null = null;
let geminiModel: any = null;

/**
 * Initialize the Gemini API with the provided API key
 * @param key Gemini API key
 */
export function initializeGeminiAPI(key: string) {
  try {
    apiKey = key;
    genAI = new GoogleGenerativeAI(apiKey);
    geminiModel = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      safetySettings,
      generationConfig,
    });
    
    // Store API key in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('gemini-api-key', key);
    }
    
    return true;
  } catch (error) {
    console.error("Failed to initialize Gemini API:", error);
    return false;
  }
}

/**
 * Check if Gemini API is initialized
 */
export function isGeminiInitialized(): boolean {
  return !!genAI && !!geminiModel;
}

/**
 * Try to initialize Gemini API from stored key
 */
export function initializeFromStoredKey(): boolean {
  if (typeof window !== 'undefined') {
    const storedKey = localStorage.getItem('gemini-api-key');
    if (storedKey) {
      return initializeGeminiAPI(storedKey);
    }
  }
  return false;
}

/**
 * Generate a chat response from Gemini
 * @param messages Array of conversation messages
 * @returns Generated response text
 */
export async function generateChatResponse(messages: { role: string; content: string }[]): Promise<string> {
  try {
    if (!isGeminiInitialized()) {
      throw new Error("Gemini API not initialized. Please provide an API key.");
    }

    // Convert to Gemini chat format
    const chatHistory = messages.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Start a chat session
    const chat = geminiModel.startChat({
      history: chatHistory.slice(0, -1), // All except the latest message
      generationConfig,
      safetySettings,
    });

    // Send the latest message
    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Error generating chat response:", error);
    
    // Return friendly error message based on the error
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return "I need a valid API key to function. Please set up your Gemini API key in the settings.";
      } else if (error.message.includes("quota")) {
        return "Your Gemini API quota has been exceeded. Please check your usage limits or try again later.";
      } else if (error.message.includes("safety")) {
        return "I couldn't process that request due to safety concerns. Please try a different question.";
      }
    }
    
    return "I encountered an error while processing your request. Please try again or check your API key.";
  }
}

// Get API key
export function getApiKey(): string {
  return apiKey;
} 