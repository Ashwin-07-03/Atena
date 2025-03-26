"use client";

import { v4 as uuidv4 } from "uuid";
import { 
  generateResponse, 
  isProviderInitialized, 
  getCurrentProvider, 
  ModelProvider 
} from "@/lib/services/model-service";

export interface ChatbotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatbotConversation {
  id: string;
  title: string;
  subject: string;
  messages: ChatbotMessage[];
  createdAt: string;
  updatedAt: string;
}

// Storage keys
const CONVERSATIONS_STORAGE_KEY = "atena-chatbot-conversations";
const ACTIVE_CONVERSATION_KEY = "atena-chatbot-active-conversation";

// Available study subjects
export const studySubjects = [
  { id: "math", name: "Mathematics", icon: "📐" },
  { id: "science", name: "Science", icon: "🔬" },
  { id: "history", name: "History", icon: "📜" },
  { id: "literature", name: "Literature", icon: "📚" },
  { id: "cs", name: "Computer Science", icon: "💻" },
  { id: "language", name: "Languages", icon: "🌎" },
  { id: "other", name: "Other Subjects", icon: "📝" }
];

// Helper function to ensure consistent date format for server/client rendering
const formatDate = (): string => {
  return new Date().toISOString();
};

/**
 * Generate a default system prompt for the chatbot based on the subject
 */
const getSystemPrompt = (subject: string): string => {
  const basePrompt = "You are Atena's Study Chatbot, a specialized educational assistant. ";
  
  switch (subject.toLowerCase()) {
    case "math":
      return basePrompt + "Focus on making mathematical concepts clear and approachable. Provide step-by-step explanations for math problems. Offer multiple perspectives when helpful. Suggest practice problems to reinforce concepts.";
    case "science":
      return basePrompt + "Explain scientific concepts with clear, accurate information. Connect scientific principles to real-world applications. Use analogies to make complex ideas more accessible. Reference key experiments and discoveries when relevant.";
    case "history":
      return basePrompt + "Present historical information accurately with context. Highlight connections between historical events and their causes/effects. Consider multiple historical perspectives. Relate historical topics to broader themes when appropriate.";
    case "literature":
      return basePrompt + "Offer nuanced analysis of literary works. Discuss themes, characters, and literary techniques. Provide context about authors and literary movements. Help with interpreting passages and developing arguments.";
    case "cs":
      return basePrompt + "Explain programming concepts clearly with examples. Provide code snippets when helpful. Break down complex topics into manageable parts. Address both theoretical computer science and practical programming.";
    case "language":
      return basePrompt + "Support language learning with clear explanations of grammar rules. Provide examples of language usage in context. Help with translations while explaining nuances. Offer practice opportunities through conversation.";
    default:
      return basePrompt + "Provide clear and helpful explanations for academic questions. Break down complex topics into understandable components. Offer examples to illustrate concepts. Suggest resources for further learning.";
  }
};

/**
 * Get all conversations from storage
 */
export const getConversations = (): ChatbotConversation[] => {
  if (typeof window === "undefined") return [];
  
  const storedData = localStorage.getItem(CONVERSATIONS_STORAGE_KEY);
  if (!storedData) return [];
  
  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error("Error parsing chatbot conversations:", error);
    return [];
  }
};

/**
 * Save conversations to storage
 */
const saveConversations = (conversations: ChatbotConversation[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(conversations));
};

/**
 * Get a specific conversation by ID
 */
export const getConversation = (conversationId: string): ChatbotConversation | null => {
  const conversations = getConversations();
  return conversations.find(c => c.id === conversationId) || null;
};

/**
 * Create a new conversation
 */
export const createConversation = (subject: string, title?: string): ChatbotConversation => {
  const subjectInfo = studySubjects.find(s => s.id === subject) || studySubjects[6]; // Default to "Other"
  const defaultTitle = title || `${subjectInfo.name} Chat`;
  
  const newConversation: ChatbotConversation = {
    id: uuidv4(),
    title: defaultTitle,
    subject: subject,
    messages: [],
    createdAt: formatDate(),
    updatedAt: formatDate()
  };
  
  const conversations = getConversations();
  saveConversations([newConversation, ...conversations]);
  setActiveConversation(newConversation.id);
  
  return newConversation;
};

/**
 * Update a conversation's title
 */
export const updateConversationTitle = (conversationId: string, title: string): void => {
  const conversations = getConversations();
  const index = conversations.findIndex(c => c.id === conversationId);
  
  if (index !== -1) {
    conversations[index].title = title;
    conversations[index].updatedAt = formatDate();
    saveConversations(conversations);
  }
};

/**
 * Delete a conversation
 */
export const deleteConversation = (conversationId: string): void => {
  let conversations = getConversations();
  conversations = conversations.filter(c => c.id !== conversationId);
  saveConversations(conversations);
  
  // If deleted conversation was active, set a new active conversation
  if (getActiveConversationId() === conversationId) {
    if (conversations.length > 0) {
      setActiveConversation(conversations[0].id);
    } else {
      clearActiveConversation();
    }
  }
};

/**
 * Get the active conversation ID
 */
export const getActiveConversationId = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_CONVERSATION_KEY);
};

/**
 * Set the active conversation
 */
export const setActiveConversation = (conversationId: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_CONVERSATION_KEY, conversationId);
};

/**
 * Clear the active conversation
 */
export const clearActiveConversation = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACTIVE_CONVERSATION_KEY);
};

/**
 * Send a message and get a response
 */
export const sendMessage = async (conversationId: string, messageText: string): Promise<boolean> => {
  if (!messageText.trim()) return false;
  
  const conversation = getConversation(conversationId);
  if (!conversation) return false;
  
  // Create user message
  const userMessage: ChatbotMessage = {
    id: uuidv4(),
    role: "user",
    content: messageText,
    timestamp: formatDate()
  };
  
  // Add to conversation
  conversation.messages.push(userMessage);
  conversation.updatedAt = formatDate();
  
  // Generate title from first message if it doesn't have a custom title
  if (conversation.messages.length === 1 && conversation.title === `${studySubjects.find(s => s.id === conversation.subject)?.name} Chat`) {
    // Generate a title based on the first message (max 50 chars)
    const titleText = messageText.length > 50 
      ? messageText.substring(0, 47) + "..."
      : messageText;
    
    conversation.title = titleText;
  }
  
  // Save updated conversation
  const conversations = getConversations();
  const index = conversations.findIndex(c => c.id === conversationId);
  
  if (index !== -1) {
    conversations[index] = conversation;
    saveConversations(conversations);
  }
  
  try {
    // Prepare conversation history for the AI
    const systemPrompt = getSystemPrompt(conversation.subject);
    const chatHistory = [
      { role: "system", content: systemPrompt },
      ...conversation.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];
    
    // Get AI response
    const provider = getCurrentProvider();
    if (!isProviderInitialized(provider)) {
      throw new Error("AI provider not initialized");
    }
    
    const response = await generateResponse(chatHistory);
    
    // Create assistant message
    const assistantMessage: ChatbotMessage = {
      id: uuidv4(),
      role: "assistant",
      content: response,
      timestamp: formatDate()
    };
    
    // Add to conversation
    conversation.messages.push(assistantMessage);
    conversation.updatedAt = formatDate();
    
    // Save updated conversation
    const updatedConversations = getConversations();
    const updatedIndex = updatedConversations.findIndex(c => c.id === conversationId);
    
    if (updatedIndex !== -1) {
      updatedConversations[updatedIndex] = conversation;
      saveConversations(updatedConversations);
    }
    
    return true;
  } catch (error) {
    console.error("Error generating chatbot response:", error);
    
    // Create error message
    const errorMessage: ChatbotMessage = {
      id: uuidv4(),
      role: "assistant",
      content: "I'm sorry, I encountered an error while processing your request. Please ensure your API settings are configured correctly in Settings.",
      timestamp: formatDate()
    };
    
    // Add to conversation
    conversation.messages.push(errorMessage);
    conversation.updatedAt = formatDate();
    
    // Save updated conversation
    const updatedConversations = getConversations();
    const updatedIndex = updatedConversations.findIndex(c => c.id === conversationId);
    
    if (updatedIndex !== -1) {
      updatedConversations[updatedIndex] = conversation;
      saveConversations(updatedConversations);
    }
    
    return false;
  }
}; 