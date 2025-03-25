"use client";

import { useState, useEffect, useRef } from "react";
import { BrainCircuit, Lightbulb, Send, Sparkles, MoreHorizontal, Download, Save, Trash, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  AIAssistantService, 
  Message, 
  StudyPlan, 
  Topic, 
  SavedPrompt 
} from "@/lib/services/ai-assistant-service";

// Sample suggested prompts (these are just UI starters and don't need persistence)
const suggestedPrompts = [
  "Explain the concept of neural networks in simple terms",
  "What's the difference between mitosis and meiosis?",
  "Summarize the key events of World War II",
  "Help me create a study plan for my calculus exam",
  "What are the steps of the scientific method?",
  "Explain how enzymes work in cellular processes",
];

export default function AIAssistantPage() {
  // State for chat
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // State for study plans
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [selectedStudyPlan, setSelectedStudyPlan] = useState<StudyPlan | null>(null);
  const [newPlanSubject, setNewPlanSubject] = useState("");
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);

  // State for saved prompts
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [isSavedPromptsOpen, setIsSavedPromptsOpen] = useState(false);

  // Load data on component mount
  useEffect(() => {
    setMessages(AIAssistantService.getMessages());
    setStudyPlans(AIAssistantService.getStudyPlans());
    setSavedPrompts(AIAssistantService.getSavedPrompts());
    
    // Set first study plan as selected if exists
    const plans = AIAssistantService.getStudyPlans();
    if (plans.length > 0) {
      setSelectedStudyPlan(plans[0]);
    }
  }, []);

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Add user message
      AIAssistantService.addMessage("user", inputMessage);
      
      // Get updated messages
      setMessages(AIAssistantService.getMessages());
      
      // Clear input
      setInputMessage("");
      
      // Get AI response (this will add to messages)
      const response = await AIAssistantService.getAIResponse(inputMessage);
      
      // Update messages state
      setMessages(AIAssistantService.getMessages());
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle using a suggested prompt
  const handleUseSuggestedPrompt = (prompt: string) => {
    setInputMessage(prompt);
  };

  // Handle creating a study plan
  const handleCreateStudyPlan = () => {
    if (!newPlanSubject.trim()) return;
    
    const newPlan = AIAssistantService.addStudyPlan(newPlanSubject);
    setStudyPlans(AIAssistantService.getStudyPlans());
    setSelectedStudyPlan(newPlan);
    setNewPlanSubject("");
    setIsPlanDialogOpen(false);
  };

  // Handle updating topic status
  const handleUpdateTopicStatus = (planId: string, topicId: string, status: "not-started" | "in-progress" | "completed") => {
    AIAssistantService.updateTopicStatus(planId, topicId, status);
    setStudyPlans(AIAssistantService.getStudyPlans());
    
    // Update selected plan if it's the one being updated
    if (selectedStudyPlan && selectedStudyPlan.id === planId) {
      const updatedPlan = AIAssistantService.getStudyPlans().find(p => p.id === planId);
      if (updatedPlan) {
        setSelectedStudyPlan(updatedPlan);
      }
    }
  };

  // Handle saving a prompt
  const handleSavePrompt = (text: string) => {
    AIAssistantService.savePrompt(text);
    setSavedPrompts(AIAssistantService.getSavedPrompts());
  };

  // Handle using a saved prompt
  const handleUseSavedPrompt = (text: string) => {
    setInputMessage(text);
    setIsSavedPromptsOpen(false);
  };

  // Handle deleting a saved prompt
  const handleDeleteSavedPrompt = (id: string) => {
    AIAssistantService.deleteSavedPrompt(id);
    setSavedPrompts(AIAssistantService.getSavedPrompts());
  };

  // Handle deleting a study plan
  const handleDeleteStudyPlan = (id: string) => {
    AIAssistantService.deleteStudyPlan(id);
    const updatedPlans = AIAssistantService.getStudyPlans();
    setStudyPlans(updatedPlans);
    
    // Update selected plan if it's the one being deleted
    if (selectedStudyPlan && selectedStudyPlan.id === id) {
      setSelectedStudyPlan(updatedPlans.length > 0 ? updatedPlans[0] : null);
    }
  };

  // Handle clearing all chat history
  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear all chat history? This cannot be undone.")) {
      AIAssistantService.clearMessages();
      setMessages([]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight mb-1">AI Study Assistant</h1>
        <p className="text-muted-foreground">Get explanations, summaries, and personalized study plans</p>
      </div>

      {/* Main content */}
      <div className="flex flex-1 gap-6 min-h-0">
        {/* Chat area (left side) */}
        <div className="flex-1 flex flex-col bg-card border rounded-md overflow-hidden">
          {/* Chat messages */}
          <div className="flex-1 overflow-auto p-4 space-y-6">
            {/* Welcome message (shown if no messages) */}
            {messages.length === 0 && (
              <div className="flex justify-center py-6">
                <div className="bg-primary/5 rounded-lg p-4 max-w-md text-center">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <BrainCircuit className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-lg mb-2">Atena AI Assistant</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    I can help explain concepts, summarize content, create study plans, and answer your academic questions.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-7"
                      onClick={() => handleUseSuggestedPrompt("What are some effective study techniques for exams?")}
                    >
                      <Sparkles className="mr-1 h-3 w-3" />
                      Study Tips
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-7"
                      onClick={() => setIsPlanDialogOpen(true)}
                    >
                      <Lightbulb className="mr-1 h-3 w-3" />
                      Create Plan
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Conversation history */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-3xl rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div
                    className={`flex justify-between items-center text-xs mt-2 ${
                      message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    <span>{message.timestamp}</span>
                    
                    {message.role === "user" && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2 text-primary-foreground/70 hover:text-primary-foreground"
                        onClick={() => handleSavePrompt(message.content)}
                      >
                        <Save className="h-3 w-3" />
                        <span className="ml-1 text-xs">Save</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-3xl rounded-lg p-4 bg-muted">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "200ms" }}></div>
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "400ms" }}></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-4 border-t">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Textarea
                  placeholder="Ask me anything about your studies..."
                  className="w-full rounded-md border-0 bg-background p-3 text-sm resize-none min-h-24 focus:ring-2 focus:ring-inset focus:ring-primary/20"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {suggestedPrompts.slice(0, 3).map((prompt, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-7"
                      onClick={() => handleUseSuggestedPrompt(prompt)}
                    >
                      {prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt}
                    </Button>
                  ))}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs h-7">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {savedPrompts.length > 0 && (
                        <DropdownMenuItem onClick={() => setIsSavedPromptsOpen(true)}>
                          Saved Prompts
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={handleClearChat}>
                        Clear Chat History
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <Button 
                size="icon" 
                className="h-10 w-10 rounded-full flex-shrink-0"
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar (right side) */}
        <div className="w-80 flex-shrink-0 hidden lg:block space-y-6 overflow-auto">
          {/* Study Plan Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Personalized Study Plan</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsPlanDialogOpen(true)}>
                      New Plan
                    </DropdownMenuItem>
                    {selectedStudyPlan && (
                      <DropdownMenuItem onClick={() => handleDeleteStudyPlan(selectedStudyPlan.id)}>
                        Delete Plan
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>AI-generated based on your interests</CardDescription>
            </CardHeader>
            <CardContent>
              {studyPlans.length > 0 ? (
                <Tabs defaultValue={studyPlans[0].id}>
                  <TabsList className="w-full mb-4">
                    {studyPlans.map((plan) => (
                      <TabsTrigger
                        key={plan.id}
                        value={plan.id}
                        className="flex-1"
                        onClick={() => setSelectedStudyPlan(plan)}
                      >
                        {plan.subject}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {studyPlans.map((plan) => (
                    <TabsContent
                      key={plan.id}
                      value={plan.id}
                      className="space-y-4"
                    >
                      {/* Topics */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Topics to Cover</h4>
                        <ul className="space-y-2">
                          {plan.topics.map((topic) => (
                            <li key={topic.id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id={`topic-${plan.id}-${topic.id}`}
                                  checked={topic.status === "completed"}
                                  onChange={(e) => handleUpdateTopicStatus(
                                    plan.id, 
                                    topic.id, 
                                    e.target.checked ? "completed" : "not-started"
                                  )}
                                  className="h-4 w-4 rounded-sm border-gray-300 text-primary focus:ring-primary"
                                />
                                <label
                                  htmlFor={`topic-${plan.id}-${topic.id}`}
                                  className={
                                    topic.status === "completed" ? "line-through text-muted-foreground" : ""
                                  }
                                >
                                  {topic.name}
                                </label>
                              </div>
                              <span className="text-xs text-muted-foreground">{topic.estimatedTime}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Resources */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Recommended Resources</h4>
                        <ul className="space-y-2">
                          {plan.resources.map((resource) => (
                            <li key={resource.id} className="flex items-center gap-2 text-sm">
                              <div
                                className={`flex-shrink-0 w-2 h-2 rounded-full ${
                                  resource.type === "textbook"
                                    ? "bg-blue-500"
                                    : resource.type === "notes"
                                    ? "bg-green-500"
                                    : resource.type === "problems"
                                    ? "bg-amber-500"
                                    : resource.type === "video"
                                    ? "bg-purple-500"
                                    : "bg-gray-500"
                                }`}
                              />
                              <a href={resource.link} className="hover:underline">
                                {resource.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground text-sm mb-4">No study plans yet</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsPlanDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Study Plan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Tools Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI Tools</CardTitle>
              <CardDescription>Special tools to enhance your learning</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => handleUseSuggestedPrompt("Generate practice questions about the topic I'm studying")}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                <span>Generate Practice Questions</span>
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => handleUseSuggestedPrompt("Analyze my learning style based on my study preferences")}
              >
                <BrainCircuit className="mr-2 h-4 w-4" />
                <span>Analyze My Learning Style</span>
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => handleUseSuggestedPrompt("Create flashcards about the following topic:")}
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                <span>Create Flashcards from Text</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Study Plan Dialog */}
      <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Study Plan</DialogTitle>
            <DialogDescription>
              Enter a subject and the AI will generate a personalized study plan
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Enter subject (e.g., Quantum Physics, Calculus, European History)"
              value={newPlanSubject}
              onChange={(e) => setNewPlanSubject(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreateStudyPlan} disabled={!newPlanSubject.trim()}>
              Create Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Saved Prompts Dialog */}
      <Dialog open={isSavedPromptsOpen} onOpenChange={setIsSavedPromptsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Saved Prompts</DialogTitle>
            <DialogDescription>
              Your previously saved prompts
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {savedPrompts.length > 0 ? (
              <ul className="space-y-3">
                {savedPrompts.map((prompt) => (
                  <li key={prompt.id} className="border rounded-md p-3">
                    <div className="text-sm mb-2">{prompt.text}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {new Date(prompt.savedAt).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7"
                          onClick={() => handleUseSavedPrompt(prompt.text)}
                        >
                          <Send className="h-3 w-3 mr-1" />
                          <span className="text-xs">Use</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteSavedPrompt(prompt.id)}
                        >
                          <Trash className="h-3 w-3 mr-1" />
                          <span className="text-xs">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                No saved prompts yet. You can save prompts by clicking 'Save' on your messages.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSavedPromptsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 