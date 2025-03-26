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

// Storage key
const API_KEY_STORAGE_KEY = 'atena-gemini-api-key';

let isInitialized = false;
let apiKey: string | null = null;
let genAI: GoogleGenerativeAI | null = null;
let geminiModel: any = null;

// Initialize the API on client-side mount
if (typeof window !== 'undefined') {
  // Try to load from localStorage
  const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (storedKey) {
    apiKey = storedKey;
    isInitialized = true;
  }
}

/**
 * Check if the API is initialized
 */
export function isGeminiInitialized(): boolean {
  return isInitialized;
}

/**
 * Get the stored API key
 */
export function getGeminiApiKey(): string | null {
  return apiKey;
}

/**
 * Initialize the API with an API key
 */
export function initializeGeminiAPI(key: string): boolean {
  if (!key) return false;
  
  try {
    apiKey = key;
    isInitialized = true;
    genAI = new GoogleGenerativeAI(apiKey);
    geminiModel = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      safetySettings,
      generationConfig,
    });
    
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem(API_KEY_STORAGE_KEY, key);
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing Gemini API:', error);
    return false;
  }
}

/**
 * Reset the API
 */
export function resetGeminiAPI(): void {
  apiKey = null;
  isInitialized = false;
  genAI = null;
  geminiModel = null;
  
  // Remove from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }
}

/**
 * Generate a response using the Gemini API
 */
export async function generateChatResponse(
  messages: { role: string; content: string }[]
): Promise<string> {
  if (!isInitialized || !apiKey) {
    throw new Error('Gemini API not initialized');
  }
  
  try {
    // Format messages for Gemini API
    const formattedMessages = messages.map(msg => {
      // Convert 'user' to 'user' and anything else to 'model'
      const role = msg.role === 'user' ? 'user' : 'model';
      return {
        role,
        parts: [{ text: msg.content }]
      };
    });
    
    // Remove system messages which Gemini doesn't support
    const filteredMessages = formattedMessages.filter(msg => 
      !messages.find((original, index) => index === formattedMessages.indexOf(msg) && original.role === 'system')
    );
    
    // Take system message content and prepend to first non-user message if present
    const systemMessage = messages.find(msg => msg.role === 'system');
    if (systemMessage && filteredMessages.length > 0) {
      const firstModelMessage = filteredMessages.find(msg => msg.role === 'model');
      if (firstModelMessage) {
        firstModelMessage.parts[0].text = `${systemMessage.content}\n\n${firstModelMessage.parts[0].text}`;
      }
    }
    
    console.log('Calling Gemini API with formatted messages:', filteredMessages);
    
    // Call Google Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: filteredMessages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
        ]
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    // Extract the response text
    if (data.candidates && data.candidates[0]?.content?.parts && data.candidates[0].content.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('No valid response from Gemini API');
    }
  } catch (error) {
    console.error('Error generating Gemini response:', error);
    throw error;
  }
} 