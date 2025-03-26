"use client";

import { useState, useEffect } from 'react';
import { 
  getConversations, 
  getActiveConversationId, 
  getConversation, 
  createConversation, 
  updateConversationTitle, 
  deleteConversation, 
  setActiveConversation as setActiveChatId, 
  sendMessage,
  ChatbotConversation
} from '@/lib/services/chatbot-service';
import { isProviderInitialized, getCurrentProvider } from '@/lib/services/model-service';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Settings, MessageSquare, Info } from 'lucide-react';
import SubjectSelect from '@/components/chatbot/subject-select';
import ChatInterface from '@/components/chatbot/chat-interface';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatTimeAgo } from '@/lib/utils';

export default function ChatbotPage() {
  const [conversations, setConversations] = useState<ChatbotConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<ChatbotConversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubjectSelectOpen, setIsSubjectSelectOpen] = useState(false);
  const [isModelInitialized, setIsModelInitialized] = useState(false);
  const [currentProvider, setCurrentProvider] = useState('');
  
  // Load conversations and check model status on mount
  useEffect(() => {
    loadConversations();
    checkModelStatus();
    
    // Check model status periodically
    const interval = setInterval(checkModelStatus, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // Load all conversations and set active conversation
  const loadConversations = () => {
    const allConversations = getConversations();
    setConversations(allConversations);
    
    // Set active conversation if one exists
    const activeId = getActiveConversationId();
    if (activeId) {
      const active = getConversation(activeId);
      if (active) {
        setActiveConversation(active);
        return;
      }
    }
    
    // If no active conversation or it wasn't found, set the first one
    if (allConversations.length > 0) {
      setActiveConversation(allConversations[0]);
      // Update active conversation ID in storage
      setActiveChatId(allConversations[0].id);
    } else {
      setActiveConversation(null);
    }
  };
  
  // Check if AI model is initialized
  const checkModelStatus = () => {
    const provider = getCurrentProvider();
    setCurrentProvider(provider);
    setIsModelInitialized(isProviderInitialized(provider));
  };
  
  // Handle selecting a conversation
  const handleSelectConversation = (conversationId: string) => {
    const selectedConversation = getConversation(conversationId);
    if (selectedConversation) {
      setActiveConversation(selectedConversation);
      // Update active conversation ID in storage
      setActiveChatId(conversationId);
    }
  };
  
  // Handle creating a new conversation
  const handleNewConversation = () => {
    setIsSubjectSelectOpen(true);
  };
  
  // Handle selecting a subject for new conversation
  const handleSelectSubject = (subjectId: string, customTitle?: string) => {
    const newConversation = createConversation(subjectId, customTitle);
    loadConversations();
    setActiveConversation(newConversation);
    setIsSubjectSelectOpen(false);
  };
  
  // Handle updating a conversation title
  const handleUpdateTitle = (conversationId: string, newTitle: string) => {
    updateConversationTitle(conversationId, newTitle);
    loadConversations();
  };
  
  // Handle deleting a conversation
  const handleDeleteConversation = (conversationId: string) => {
    if (window.confirm('Are you sure you want to delete this conversation? This cannot be undone.')) {
      deleteConversation(conversationId);
      loadConversations();
    }
  };
  
  // Handle sending a message
  const handleSendMessage = async (message: string) => {
    if (!activeConversation) return;
    
    setIsLoading(true);
    try {
      await sendMessage(activeConversation.id, message);
      // Reload conversations to get the updated one with AI response
      loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="h-full flex-1 flex flex-col space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Study Chatbot</h1>
          <p className="text-muted-foreground">
            Chat with an AI tutor specialized in different subjects to enhance your learning
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {!isModelInitialized && (
            <Link href="/dashboard/settings">
              <Button variant="outline" size="sm" className="gap-1">
                <Settings className="h-4 w-4" />
                <span>Configure AI</span>
              </Button>
            </Link>
          )}
          
          <Button onClick={handleNewConversation} className="gap-1">
            <PlusCircle className="h-4 w-4" />
            <span>New Chat</span>
          </Button>
        </div>
      </div>
      
      {!isModelInitialized && (
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Please configure your AI provider in 
            <Link href="/dashboard/settings" className="font-medium underline mx-1">Settings</Link>
            to use the chatbot.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid flex-1 gap-4 md:grid-cols-[260px_1fr]">
        {/* Sidebar with conversations */}
        <div className="hidden md:block">
          <Card className="h-full">
            <CardHeader className="py-4">
              <CardTitle>Conversations</CardTitle>
              <CardDescription>Your study chat history</CardDescription>
            </CardHeader>
            
            <ScrollArea className="flex-1 h-[calc(100vh-15rem)]">
              <CardContent className="space-y-2">
                {conversations.length > 0 ? (
                  conversations.map((conversation) => (
                    <Button
                      key={conversation.id}
                      variant={activeConversation?.id === conversation.id ? "default" : "ghost"}
                      className="w-full justify-start text-left"
                      onClick={() => handleSelectConversation(conversation.id)}
                    >
                      <div className="flex items-center gap-2 w-full overflow-hidden">
                        <MessageSquare className="h-4 w-4 flex-shrink-0" />
                        <div className="truncate flex-1">
                          <div className="font-medium truncate">{conversation.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatTimeAgo(new Date(conversation.updatedAt))}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))
                ) : (
                  <div className="py-12 text-center text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No conversations yet</p>
                    <p className="text-sm mt-1">Start a new chat to begin studying</p>
                  </div>
                )}
              </CardContent>
            </ScrollArea>
            
            <CardFooter className="border-t p-4">
              <Button onClick={handleNewConversation} className="w-full gap-1">
                <PlusCircle className="h-4 w-4" />
                <span>New Chat</span>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Main chat area */}
        <Card className="flex-1">
          {activeConversation ? (
            <div className="h-[calc(100vh-11rem)]">
              <ChatInterface
                conversation={activeConversation}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
                onEditTitle={handleUpdateTitle}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-[calc(100vh-11rem)]">
              <div className="text-center max-w-md">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <h3 className="text-xl font-semibold mb-2">Start a New Chat</h3>
                <p className="text-muted-foreground mb-6">
                  Choose a subject to start chatting with the AI tutor. Get help with homework, 
                  prepare for exams, or deepen your understanding of complex topics.
                </p>
                <Button onClick={handleNewConversation} size="lg" className="gap-1">
                  <PlusCircle className="h-4 w-4" />
                  <span>New Chat</span>
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
      
      {/* Subject selection dialog */}
      <SubjectSelect
        isOpen={isSubjectSelectOpen}
        onClose={() => setIsSubjectSelectOpen(false)}
        onSelectSubject={handleSelectSubject}
      />
    </div>
  );
} 