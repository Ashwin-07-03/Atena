import { Metadata } from "next";
import { Plus, Book, Brain, BarChart, Clock, Search, MoreHorizontal, ChevronRight, Bookmark, CheckCircle2, X, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export const metadata: Metadata = {
  title: "Flashcards | Atena",
  description: "Create and study flashcards with spaced repetition",
};

// Sample deck data
const decks = [
  {
    id: "1",
    title: "Physics: Quantum Mechanics",
    description: "Key concepts and formulas for quantum physics",
    cardCount: 42,
    mastery: 68,
    lastStudied: "Today",
    dueCards: 12,
  },
  {
    id: "2",
    title: "Computer Science: Algorithms",
    description: "Common algorithms and their complexities",
    cardCount: 35,
    mastery: 81,
    lastStudied: "Yesterday",
    dueCards: 5,
  },
  {
    id: "3",
    title: "Biology: Cell Structure",
    description: "Cell components and their functions",
    cardCount: 28,
    mastery: 92,
    lastStudied: "2 days ago",
    dueCards: 0,
  },
  {
    id: "4",
    title: "Mathematics: Linear Algebra",
    description: "Vectors, matrices, and transformations",
    cardCount: 56,
    mastery: 45,
    lastStudied: "5 days ago",
    dueCards: 22,
  },
  {
    id: "5",
    title: "History: World War II",
    description: "Key events, figures, and dates",
    cardCount: 64,
    mastery: 38,
    lastStudied: "1 week ago",
    dueCards: 38,
  },
  {
    id: "6",
    title: "Chemistry: Organic Reactions",
    description: "Common organic chemistry reactions and mechanisms",
    cardCount: 49,
    mastery: 72,
    lastStudied: "3 days ago",
    dueCards: 8,
  },
];

// Sample flashcard data for the "Quantum Mechanics" deck
const flashcards = [
  {
    id: "1",
    front: "What is Heisenberg's Uncertainty Principle?",
    back: "The more precisely the position of a particle is determined, the less precisely its momentum can be predicted, and vice versa. Mathematically: ΔxΔp ≥ ħ/2",
    difficulty: "medium",
    nextReview: "Today",
    streak: 3,
  },
  {
    id: "2",
    front: "Define quantum superposition",
    back: "A principle of quantum mechanics that states that any two (or more) quantum states can be added together and the result will be another valid quantum state. Also, every quantum state can be represented as a sum of two or more distinct quantum states.",
    difficulty: "hard",
    nextReview: "Tomorrow",
    streak: 1,
  },
  {
    id: "3",
    front: "What is Schrödinger's equation?",
    back: "A linear partial differential equation that describes the wave function of a quantum-mechanical system. The general form is: iħ∂Ψ/∂t = ĤΨ",
    difficulty: "hard",
    nextReview: "Today",
    streak: 0,
  },
  {
    id: "4",
    front: "What is a wave function (Ψ)?",
    back: "A mathematical function that describes the quantum state of an isolated quantum system. The wave function is a complex-valued probability amplitude, and its modulus squared gives the probability density.",
    difficulty: "medium",
    nextReview: "2 days",
    streak: 4,
  },
  {
    id: "5",
    front: "Explain quantum entanglement",
    back: "A physical phenomenon that occurs when a group of particles are generated, interact, or share spatial proximity in a way such that the quantum state of each particle of the group cannot be described independently of the state of the others, including when the particles are separated by a large distance.",
    difficulty: "hard",
    nextReview: "Today",
    streak: 2,
  },
];

export default function FlashcardsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Flashcards</h1>
          <p className="text-muted-foreground">
            Create and study flashcards with AI-powered spaced repetition
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Search className="mr-2 h-4 w-4" />
            Search Cards
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Deck
          </Button>
        </div>
      </div>

      {/* Main content */}
      <Tabs defaultValue="all-decks">
        <TabsList className="w-full sm:w-auto mb-4">
          <TabsTrigger value="all-decks">All Decks</TabsTrigger>
          <TabsTrigger value="due-today">Due Today</TabsTrigger>
          <TabsTrigger value="recently-studied">Recently Studied</TabsTrigger>
          <TabsTrigger value="study-session">Study Session</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-decks">
          {/* Deck grid */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {decks.map((deck) => (
              <Card key={deck.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{deck.title}</CardTitle>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>{deck.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Book className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{deck.cardCount} cards</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{deck.lastStudied}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-xs">
                      <span>Mastery</span>
                      <span className="font-medium">{deck.mastery}%</span>
                    </div>
                    <Progress value={deck.mastery} />
                  </div>
                  
                  {deck.dueCards > 0 && (
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      {deck.dueCards} cards due
                    </Badge>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button variant="outline" size="sm">
                    <Plus className="mr-1 h-4 w-4" />
                    Add Cards
                  </Button>
                  <Button size="sm">
                    Study Now
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {/* Create new deck card */}
            <Card className="border-dashed hover:border-primary/50 transition-colors">
              <CardContent className="flex flex-col items-center justify-center h-full py-10">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-1">Create New Deck</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Organize your knowledge with customized flashcard decks
                </p>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Deck
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="study-session">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Physics: Quantum Mechanics</CardTitle>
                  <CardDescription>Studying 5 of 42 cards</CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm">
                    <X className="mr-1 h-4 w-4" />
                    End Session
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-6">
                <div className="text-sm text-muted-foreground mb-2">Card 3 of 5</div>
                <Progress value={60} className="w-64 mb-6" />
                
                {/* Flashcard component */}
                <div className="w-full max-w-md h-64 perspective">
                  <div className="relative w-full h-full preserve-3d transition-transform duration-500">
                    <div className="absolute w-full h-full backface-hidden bg-card border rounded-lg p-8 flex flex-col">
                      <div className="flex-1 flex items-center justify-center text-center text-lg font-medium">
                        What is Schrödinger's equation?
                      </div>
                      <div className="text-xs text-muted-foreground text-center">
                        Click to reveal answer
                      </div>
                    </div>
                    <div className="absolute w-full h-full backface-hidden bg-card border rounded-lg p-8 flex flex-col rotate-y-180">
                      <div className="flex-1 overflow-auto text-base">
                        A linear partial differential equation that describes the wave function of a quantum-mechanical system. The general form is: iħ∂Ψ/∂t = ĤΨ
                      </div>
                      <div className="text-xs text-muted-foreground text-center">
                        How well did you know this?
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center gap-2 mb-4">
                <Button variant="outline" className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20">
                  <X className="mr-1 h-4 w-4" />
                  Didn't Know
                </Button>
                <Button variant="outline" className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/20">
                  <RotateCw className="mr-1 h-4 w-4" />
                  Difficult
                </Button>
                <Button variant="outline" className="bg-green-500/10 hover:bg-green-500/20 text-green-500 border-green-500/20">
                  <CheckCircle2 className="mr-1 h-4 w-4" />
                  Easy
                </Button>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Brain className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium mb-1">AI Learning Assistant</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      To better understand Schrödinger's equation, remember that:
                    </p>
                    <ul className="text-sm space-y-1 list-disc pl-4 text-muted-foreground">
                      <li>It describes how the quantum state changes with time</li>
                      <li>The Hamiltonian operator (Ĥ) represents the total energy of the system</li>
                      <li>For a time-independent Hamiltonian, you can separate variables to find energy eigenstates</li>
                      <li>The solution Ψ(x,t) is a wave function, not directly observable</li>
                    </ul>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        <Bookmark className="mr-1 h-3 w-3" />
                        Save Explanation
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <div className="text-sm text-muted-foreground">
                Progress this session: <span className="font-medium">60%</span>
              </div>
              <Button>
                Next Card
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="due-today">
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Due Today</CardTitle>
                <CardDescription>
                  You have 43 cards due for review across 4 decks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {decks.filter(deck => deck.dueCards > 0).map((deck) => (
                    <div key={deck.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Book className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{deck.title}</h3>
                          <div className="text-sm text-muted-foreground">
                            {deck.dueCards} cards due
                          </div>
                        </div>
                      </div>
                      <Button size="sm">
                        Study Now
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>AI-Powered Study Insights</CardTitle>
                <CardDescription>
                  Custom recommendations based on your learning patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Brain className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Most Challenging Cards</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Your review data shows you're struggling with these concepts:
                        </p>
                        <div className="space-y-2 mb-3">
                          {flashcards.filter(card => card.difficulty === "hard").map((card) => (
                            <div key={card.id} className="text-sm p-2 bg-muted rounded-md">
                              <div className="font-medium">{card.front}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Streak: {card.streak} • Last reviewed: {card.nextReview}
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" size="sm">
                          Review Difficult Cards
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <BarChart className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Learning Progress</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Your spaced repetition schedule is optimized for maximum retention.
                        </p>
                        <div className="h-24 flex items-end gap-1 mb-3">
                          {[12, 5, 8, 14, 22, 18, 10].map((count, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center">
                              <div 
                                className="w-full bg-primary rounded-t-sm"
                                style={{ height: `${(count / 25) * 100}%` }}
                              ></div>
                              <div className="text-xs mt-2 text-muted-foreground">
                                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          You've reviewed <span className="font-medium">89 cards</span> this week
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 