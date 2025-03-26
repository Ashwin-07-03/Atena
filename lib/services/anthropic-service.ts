"use client";

import Anthropic from '@anthropic-ai/sdk';

// Generation configuration
const generationConfig = {
  temperature: 0.7,
  max_tokens: 1024,
  top_p: 0.95,
};

// Initialize with API key or use environment variable
let apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '';
let anthropic: Anthropic | null = null;

/**
 * Initialize the Anthropic API with the provided API key
 * @param key Anthropic API key
 */
export function initializeAnthropicAPI(key: string) {
  try {
    apiKey = key;
    anthropic = new Anthropic({
      apiKey: key,
    });
    
    // Store API key in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('anthropic-api-key', key);
    }
    
    return true;
  } catch (error) {
    console.error("Failed to initialize Anthropic API:", error);
    return false;
  }
}

/**
 * Check if Anthropic API is initialized
 */
export function isAnthropicInitialized(): boolean {
  return !!anthropic;
}

/**
 * Try to initialize Anthropic API from stored key
 */
export function initializeFromStoredKey(): boolean {
  if (typeof window !== 'undefined') {
    const storedKey = localStorage.getItem('anthropic-api-key');
    if (storedKey) {
      return initializeAnthropicAPI(storedKey);
    }
  }
  return false;
}

/**
 * Generate a chat response from Claude
 * @param messages Array of conversation messages
 * @returns Generated response text
 */
export async function generateChatResponse(messages: { role: string; content: string }[]): Promise<string> {
  try {
    if (!isAnthropicInitialized() || !anthropic) {
      throw new Error("Anthropic API not initialized. Please provide an API key.");
    }

    // Convert to Anthropic chat format
    const systemMessage = "You are Atena, an AI educational assistant.";
    const formattedMessages = messages.map(msg => {
      // Ensure role is strictly typed as "user" or "assistant"
      const role = msg.role === "user" ? "user" : "assistant";
      return {
        role: role as "user" | "assistant",
        content: msg.content
      };
    });

    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      system: systemMessage,
      messages: formattedMessages,
      temperature: generationConfig.temperature,
      max_tokens: generationConfig.max_tokens,
      top_p: generationConfig.top_p,
    });

    // Safely extract text from the response
    if (response.content[0].type === 'text') {
      return response.content[0].text;
    } else {
      return "Response received but no text content was found.";
    }
  } catch (error) {
    console.error("Error generating chat response:", error);
    
    // Return friendly error message based on the error
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return "I need a valid API key to function. Please set up your Anthropic API key in the settings.";
      } else if (error.message.includes("quota") || error.message.includes("rate limit")) {
        return "Your Anthropic API quota has been exceeded. Please check your usage limits or try again later.";
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
 * Reset Anthropic API by clearing all in-memory state and local storage
 */
export function resetAnthropicAPI(): void {
  // Reset in-memory variables
  apiKey = '';
  anthropic = null;
  
  // Remove from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('anthropic-api-key');
  }
} 