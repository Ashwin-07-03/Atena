"use client";

import { useState, useEffect } from "react";
import { 
  ChatLayout, 
  RecommendedPrompt,
  AITool 
} from "@/components/ui/chat-layout";
import { AIAssistantService, ChatSession, SavedPrompt } from "@/lib/services/ai-assistant-service";
import { isGeminiInitialized, initializeFromStoredKey, resetGeminiAPI } from "@/lib/services/gemini-service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Lightbulb, 
  Sparkles, 
  BrainCircuit, 
  GraduationCap,
  FileQuestion,
  BookOpen,
  BookMarked,
  Layers,
  LineChart,
  Settings
} from "lucide-react";

// Sample recommended prompts for quick access
const recommendedPrompts: RecommendedPrompt[] = [
  {
    id: "prompt-1",
    text: "Explain the concept of neural networks in simple terms",
    icon: <BrainCircuit className="h-4 w-4" />
  },
  {
    id: "prompt-2",
    text: "What's the difference between mitosis and meiosis?",
    icon: <Layers className="h-4 w-4" />
  },
  {
    id: "prompt-3",
    text: "Summarize the key events of World War II",
    icon: <BookOpen className="h-4 w-4" />
  },
  {
    id: "prompt-4",
    text: "Help me create a study plan for my calculus exam",
    icon: <GraduationCap className="h-4 w-4" />
  },
  {
    id: "prompt-5",
    text: "What are the steps of the scientific method?",
    icon: <Lightbulb className="h-4 w-4" />
  },
  {
    id: "prompt-6",
    text: "Explain how enzymes work in cellular processes",
    icon: <BookMarked className="h-4 w-4" />
  },
];

// AI tools that provide specialized functionality
const aiTools: AITool[] = [
  {
    id: "tool-1",
    name: "Practice Questions Generator",
    description: "Generate practice questions about any topic",
    prompt: "Generate practice questions about the topic I'm studying: ",
    icon: <FileQuestion className="h-4 w-4" />,
    color: "bg-purple-500/10 text-purple-500"
  },
  {
    id: "tool-2",
    name: "Learning Style Analyzer",
    description: "Analyze your learning style to improve study habits",
    prompt: "Analyze my learning style based on my study preferences: ",
    icon: <BrainCircuit className="h-4 w-4" />,
    color: "bg-blue-500/10 text-blue-500"
  },
  {
    id: "tool-3",
    name: "Flashcard Creator",
    description: "Create flashcards for any subject",
    prompt: "Create flashcards about the following topic: ",
    icon: <Layers className="h-4 w-4" />,
    color: "bg-amber-500/10 text-amber-500"
  },
  {
    id: "tool-4",
    name: "Study Plan Generator",
    description: "Get a personalized study plan for any subject",
    prompt: "Create a study plan for: ",
    icon: <GraduationCap className="h-4 w-4" />,
    color: "bg-emerald-500/10 text-emerald-500"
  },
  {
    id: "tool-5",
    name: "Concept Explainer",
    description: "Get simple explanations of complex topics",
    prompt: "Explain this concept in simple terms: ",
    icon: <Lightbulb className="h-4 w-4" />,
    color: "bg-pink-500/10 text-pink-500"
  },
  {
    id: "tool-6",
    name: "Progress Tracker",
    description: "Track your learning progress and get insights",
    prompt: "Help me track my progress in studying: ",
    icon: <LineChart className="h-4 w-4" />,
    color: "bg-cyan-500/10 text-cyan-500"
  }
];

export default function AIAssistantPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [isUsingGemini, setIsUsingGemini] = useState(false);

  // Load chat sessions and saved prompts on component mount
  useEffect(() => {
    // Try to migrate old messages first (if any)
    AIAssistantService.migrateOldMessages();
    
    // Try to initialize Gemini from stored key
    const geminiInitialized = initializeFromStoredKey();
    setIsUsingGemini(geminiInitialized);
    
    // Get all sessions
    const allSessions = AIAssistantService.getChatSessions();
    setSessions(allSessions);
    
    // Get saved prompts
    setSavedPrompts(AIAssistantService.getSavedPrompts());
    
    // Get active session
    const activeSessionId = AIAssistantService.getActiveSessionId();
    if (activeSessionId) {
      const currentSession = allSessions.find(s => s.id === activeSessionId);
      setActiveSession(currentSession || null);
    } else if (allSessions.length > 0) {
      // Set the first session as active if no active session
      setActiveSession(allSessions[0]);
      AIAssistantService.setActiveSession(allSessions[0].id);
    } else {
      // Create a new session if none exist
      const newSession = AIAssistantService.createNewSession();
      setSessions([newSession]);
      setActiveSession(newSession);
    }
  }, []);

  // Check Gemini status periodically
  useEffect(() => {
    const checkGeminiStatus = () => {
      const initialized = isGeminiInitialized();
      setIsUsingGemini(initialized);
      
      // If localStorage key is gone but state shows initialized, reset state
      if (typeof window !== 'undefined' && !localStorage.getItem('gemini-api-key') && initialized) {
        resetGeminiAPI();
        setIsUsingGemini(false);
      }
    };
    
    // Check immediately
    checkGeminiStatus();
    
    // Then check periodically
    const interval = setInterval(checkGeminiStatus, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Create a new chat session
  const handleNewSession = () => {
    const newSession = AIAssistantService.createNewSession();
    setSessions(AIAssistantService.getChatSessions());
    setActiveSession(newSession);
    setInputMessage("");
  };

  // Switch to a different chat session
  const handleSelectSession = (sessionId: string) => {
    const session = AIAssistantService.getSession(sessionId);
    if (session) {
      setActiveSession(session);
      AIAssistantService.setActiveSession(sessionId);
    }
  };

  // Edit a session title
  const handleEditSessionTitle = (sessionId: string, title: string) => {
    AIAssistantService.updateSessionTitle(sessionId, title);
    setSessions(AIAssistantService.getChatSessions());
    
    // Update active session if it's the one being edited
    if (activeSession && activeSession.id === sessionId) {
      const updatedSession = AIAssistantService.getSession(sessionId);
      if (updatedSession) {
        setActiveSession(updatedSession);
      }
    }
  };

  // Delete a session
  const handleDeleteSession = (sessionId: string) => {
    if (window.confirm("Are you sure you want to delete this chat? This cannot be undone.")) {
      AIAssistantService.deleteSession(sessionId);
      const updatedSessions = AIAssistantService.getChatSessions();
      setSessions(updatedSessions);
      
      // Update active session if it's the one being deleted
      if (activeSession && activeSession.id === sessionId) {
        if (updatedSessions.length > 0) {
          const newActiveSession = updatedSessions[0];
          setActiveSession(newActiveSession);
          AIAssistantService.setActiveSession(newActiveSession.id);
        } else {
          // Create a new session if all were deleted
          const newSession = AIAssistantService.createNewSession();
          setSessions([newSession]);
          setActiveSession(newSession);
        }
      }
    }
  };

  // Send a message
  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !activeSession) return;
    
    setIsLoading(true);
    setInputMessage("");
    
    try {
      // Get AI response
      await AIAssistantService.getAIResponse(message);
      
      // Update the sessions and active session
      setSessions(AIAssistantService.getChatSessions());
      const activeSessionId = AIAssistantService.getActiveSessionId();
      if (activeSessionId) {
        const updatedActiveSession = AIAssistantService.getSession(activeSessionId);
        if (updatedActiveSession) {
          setActiveSession(updatedActiveSession);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle when a recommended prompt is selected
  const handleRecommendedPrompt = (prompt: string) => {
    setInputMessage(prompt);
  };

  // Handle when an AI tool is selected
  const handleAITool = (prompt: string) => {
    setInputMessage(prompt);
  };

  // Save a prompt for later use
  const handleSavePrompt = (text: string) => {
    AIAssistantService.savePrompt(text);
    setSavedPrompts(AIAssistantService.getSavedPrompts());
  };

  // Delete a saved prompt
  const handleDeleteSavedPrompt = (id: string) => {
    AIAssistantService.deleteSavedPrompt(id);
    setSavedPrompts(AIAssistantService.getSavedPrompts());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">AI Assistant</h1>
          <p className="text-muted-foreground">Your personal AI study assistant</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:flex items-center gap-1 text-purple-600 border-purple-200 hover:bg-purple-50 hover:text-purple-700"
            onClick={() => handleRecommendedPrompt("What are some effective study techniques for exams?")}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Study Tips</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            onClick={() => handleAITool("Create a study plan for: ")}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Create Plan</span>
          </Button>
          <Link href="/dashboard/ai/settings">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
            >
              <Settings className="h-3.5 w-3.5" />
              <span className="hidden md:inline">API Settings</span>
            </Button>
          </Link>
        </div>
      </div>
      
      <ChatLayout
        sessions={sessions}
        activeSession={activeSession}
        isLoading={isLoading}
        inputMessage={inputMessage}
        defaultSidebarOpen={false}
        recommendedPrompts={recommendedPrompts}
        aiTools={aiTools}
        savedPrompts={savedPrompts}
        isUsingGemini={isUsingGemini}
        apiSettingsLink="/dashboard/ai/settings"
        onNewSession={handleNewSession}
        onSelectSession={handleSelectSession}
        onEditSessionTitle={handleEditSessionTitle}
        onDeleteSession={handleDeleteSession}
        onSendMessage={handleSendMessage}
        onInputChange={setInputMessage}
        onRecommendedPrompt={handleRecommendedPrompt}
        onAITool={handleAITool}
        onSavePrompt={handleSavePrompt}
        onDeleteSavedPrompt={handleDeleteSavedPrompt}
      />
    </div>
  );
} 