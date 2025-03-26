"use client";

import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

// Generation configuration
const generationConfig = {
  temperature: 0.7,
  max_tokens: 1024,
  top_p: 0.95,
};

// Initialize with API key or use environment variable
let apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
let openai: OpenAI | null = null;

/**
 * Initialize the OpenAI API with the provided API key
 * @param key OpenAI API key
 */
export function initializeOpenAIAPI(key: string) {
  try {
    apiKey = key;
    openai = new OpenAI({
      apiKey: key,
      dangerouslyAllowBrowser: true // Note: This is required for client-side usage
    });
    
    // Store API key in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('openai-api-key', key);
    }
    
    return true;
  } catch (error) {
    console.error("Failed to initialize OpenAI API:", error);
    return false;
  }
}

/**
 * Check if OpenAI API is initialized
 */
export function isOpenAIInitialized(): boolean {
  return !!openai;
}

/**
 * Try to initialize OpenAI API from stored key
 */
export function initializeFromStoredKey(): boolean {
  if (typeof window !== 'undefined') {
    const storedKey = localStorage.getItem('openai-api-key');
    if (storedKey) {
      return initializeOpenAIAPI(storedKey);
    }
  }
  return false;
}

/**
 * Generate a chat response from OpenAI
 * @param messages Array of conversation messages
 * @returns Generated response text
 */
export async function generateChatResponse(messages: { role: string; content: string }[]): Promise<string> {
  try {
    if (!isOpenAIInitialized() || !openai) {
      throw new Error("OpenAI API not initialized. Please provide an API key.");
    }

    // Convert to OpenAI chat format
    const formattedMessages: ChatCompletionMessageParam[] = messages.map(msg => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content
    } as ChatCompletionMessageParam));

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: formattedMessages,
      temperature: generationConfig.temperature,
      max_tokens: generationConfig.max_tokens,
      top_p: generationConfig.top_p,
    });

    return response.choices[0].message.content || "No response generated";
  } catch (error) {
    console.error("Error generating chat response:", error);
    
    // Return friendly error message based on the error
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return "I need a valid API key to function. Please set up your OpenAI API key in the settings.";
      } else if (error.message.includes("quota") || error.message.includes("rate limit")) {
        return "Your OpenAI API quota has been exceeded. Please check your usage limits or try again later.";
      }
    }
    
    return "I encountered an error while processing your request. Please try again or check your API key.";
  }
}

// Get API key
export function getApiKey(): string {
  return apiKey;
}

/**
 * Reset OpenAI API by clearing all in-memory state and local storage
 */
export function resetOpenAIAPI(): void {
  // Reset in-memory variables
  apiKey = '';
  openai = null;
  
  // Remove from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('openai-api-key');
  }
} 