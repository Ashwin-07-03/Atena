import { Metadata } from "next";
import { useState } from "react";
import { BrainCircuit, Lightbulb, Send, Sparkles, MoreHorizontal, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "AI Assistant | Atena",
  description: "Your personal AI study assistant",
};

// Sample conversation data
const conversationHistory = [
  {
    role: "user",
    message: "Can you explain how quantum tunneling works?",
    timestamp: "2:32 PM",
  },
  {
    role: "assistant",
    message: "Quantum tunneling is a quantum mechanical phenomenon where a particle passes through a potential energy barrier that it classically could not surmount. This plays an essential role in several physical phenomena, such as nuclear fusion in stars, and has applications in modern technologies like the scanning tunneling microscope.\n\nIn classical mechanics, if a particle doesn't have enough energy to overcome a barrier, it will be reflected. However, in quantum mechanics, particles behave as waves with a probability distribution. When these waves encounter a barrier, there's a small but non-zero probability that the particle will 'tunnel' through to the other side, even if it lacks the energy to overcome the barrier classically.",
    timestamp: "2:33 PM",
  },
  {
    role: "user",
    message: "How is this related to the Heisenberg uncertainty principle?",
    timestamp: "2:35 PM",
  },
  {
    role: "assistant",
    message: "The Heisenberg uncertainty principle is intimately related to quantum tunneling!\n\nThe uncertainty principle states that we cannot simultaneously know both the position and momentum of a particle with perfect precision. The more precisely we know the position, the less precisely we know the momentum, and vice versa.\n\nThis inherent uncertainty means that when a particle approaches a barrier, there's uncertainty in its position. The particle might have a small probability of being found on the other side of the barrier, even if classically it doesn't have enough energy to overcome it. This is exactly what happens in quantum tunneling.\n\nMathematically, the wave function of the particle doesn't abruptly drop to zero at the barrier but decays exponentially inside it. If the barrier is thin enough, the wave function may still have a non-zero value on the other side, meaning there's a probability of finding the particle there. This is quantum tunneling, enabled by the position uncertainty described by the Heisenberg principle.",
    timestamp: "2:36 PM",
  },
];

// Sample study plan data
const studyPlanData = [
  {
    subject: "Physics",
    topics: [
      { name: "Quantum Mechanics", status: "completed", estimatedTime: "2 hours" },
      { name: "Thermodynamics", status: "in-progress", estimatedTime: "3 hours" },
      { name: "Electromagnetism", status: "not-started", estimatedTime: "4 hours" },
    ],
    resources: [
      { title: "Introduction to Quantum Mechanics", type: "textbook", link: "#" },
      { title: "Thermodynamics Lecture Notes", type: "notes", link: "#" },
      { title: "Electromagnetism Practice Problems", type: "problems", link: "#" },
    ],
  },
  {
    subject: "Mathematics",
    topics: [
      { name: "Calculus", status: "completed", estimatedTime: "3 hours" },
      { name: "Linear Algebra", status: "not-started", estimatedTime: "4 hours" },
      { name: "Probability Theory", status: "not-started", estimatedTime: "3 hours" },
    ],
    resources: [
      { title: "Calculus: Early Transcendentals", type: "textbook", link: "#" },
      { title: "Linear Algebra Practice", type: "problems", link: "#" },
      { title: "Introduction to Probability", type: "video", link: "#" },
    ],
  },
];

// Sample suggested prompts
const suggestedPrompts = [
  "Explain the concept of neural networks in simple terms",
  "What's the difference between mitosis and meiosis?",
  "Summarize the key events of World War II",
  "Help me create a study plan for my calculus exam",
  "What are the steps of the scientific method?",
  "Explain how enzymes work in cellular processes",
];

export default function AIAssistantPage() {
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
            {/* Welcome message */}
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
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    <Sparkles className="mr-1 h-3 w-3" />
                    Study Tips
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    <Lightbulb className="mr-1 h-3 w-3" />
                    Create Plan
                  </Button>
                </div>
              </div>
            </div>

            {/* Conversation history */}
            {conversationHistory.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-3xl rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.message}</div>
                  <div
                    className={`text-xs mt-2 ${
                      message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {message.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input area */}
          <div className="p-4 border-t">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <textarea
                  placeholder="Ask me anything about your studies..."
                  className="w-full rounded-md border-0 bg-background p-3 text-sm resize-none min-h-24 focus:ring-2 focus:ring-inset focus:ring-primary/20"
                  defaultValue=""
                ></textarea>
                <div className="mt-2 flex flex-wrap gap-2">
                  {suggestedPrompts.slice(0, 3).map((prompt, index) => (
                    <Button key={index} variant="outline" size="sm" className="text-xs h-7">
                      {prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt}
                    </Button>
                  ))}
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Button size="icon" className="h-10 w-10 rounded-full flex-shrink-0">
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
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>AI-generated based on your progress</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={studyPlanData[0].subject.toLowerCase()}>
                <TabsList className="w-full mb-4">
                  {studyPlanData.map((subject) => (
                    <TabsTrigger
                      key={subject.subject}
                      value={subject.subject.toLowerCase()}
                      className="flex-1"
                    >
                      {subject.subject}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {studyPlanData.map((subject) => (
                  <TabsContent
                    key={subject.subject}
                    value={subject.subject.toLowerCase()}
                    className="space-y-4"
                  >
                    {/* Topics */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Topics to Cover</h4>
                      <ul className="space-y-2">
                        {subject.topics.map((topic, index) => (
                          <li key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`topic-${subject.subject}-${index}`}
                                checked={topic.status === "completed"}
                                className="h-4 w-4 rounded-sm border-gray-300 text-primary focus:ring-primary"
                                readOnly
                              />
                              <label
                                htmlFor={`topic-${subject.subject}-${index}`}
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
                        {subject.resources.map((resource, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <div
                              className={`flex-shrink-0 w-2 h-2 rounded-full ${
                                resource.type === "textbook"
                                  ? "bg-blue-500"
                                  : resource.type === "notes"
                                  ? "bg-green-500"
                                  : resource.type === "problems"
                                  ? "bg-amber-500"
                                  : "bg-purple-500"
                              }`}
                            />
                            <a href={resource.link} className="hover:underline">
                              {resource.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      Generate Detailed Plan
                    </Button>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* AI Features Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">AI Tools</CardTitle>
              <CardDescription>Special tools to enhance your learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm h-9">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Practice Questions
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm h-9">
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  Analyze My Learning Style
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm h-9">
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Create Flashcards from Text
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 