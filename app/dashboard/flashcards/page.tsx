"use client";

import { useState, useEffect } from "react";
import { Metadata } from "next";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Book, 
  Clock, 
  Calendar, 
  Trash2, 
  Edit, 
  ChevronRight,
  BarChart 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  getDecks, 
  createDeck, 
  getDeckStats, 
  deleteDeck, 
  Deck, 
  getCardsToReview
} from "@/lib/flashcards";
import { DeckForm } from "@/components/flashcards/deck-form";
import { DeckDetail } from "@/components/flashcards/deck-detail";
import { StudySession } from "@/components/flashcards/study-session";

export const metadata: Metadata = {
  title: "Flashcards | Atena",
  description: "Create and study flashcards with spaced repetition",
};

export default function FlashcardsPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [studyDeckId, setStudyDeckId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deckStats, setDeckStats] = useState<{[key: string]: {
    totalCards: number;
    masteredCards: number;
    cardsToReview: number;
    mastery: number;
  }}>({}); 
  
  // Load decks from storage
  useEffect(() => {
    const loadDecks = () => {
      const storedDecks = getDecks();
      setDecks(storedDecks);
      
      // Get stats for each deck
      const stats = storedDecks.reduce((acc, deck) => {
        acc[deck.id] = getDeckStats(deck.id);
        return acc;
      }, {} as {[key: string]: ReturnType<typeof getDeckStats>});
      
      setDeckStats(stats);
    };
    
    loadDecks();
    
    // Set up a window event listener to reload data when localStorage changes
    const handleStorageChange = () => loadDecks();
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Filter decks by search term
  const filteredDecks = decks.filter(deck => 
    deck.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    deck.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deck.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Cards due for review today
  const dueCards = getCardsToReview();
  
  // Decks that have been studied recently (in last 3 days)
  const recentlyStudiedDecks = decks.filter(deck => {
    return deck.cards.some(card => {
      if (!card.lastReviewed) return false;
      const lastReviewed = new Date(card.lastReviewed);
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      return lastReviewed >= threeDaysAgo;
    });
  });

  const handleDeckSubmit = (deck: Deck) => {
    setIsCreatingDeck(false);
    setEditingDeck(null);
    
    // Trigger storage event to reload decks
    window.dispatchEvent(new Event("storage"));
  };

  const handleDeleteDeck = (deckId: string) => {
    if (window.confirm("Are you sure you want to delete this deck? This action cannot be undone.")) {
      deleteDeck(deckId);
      // Trigger storage event to reload decks
      window.dispatchEvent(new Event("storage"));
    }
  };

  const startStudySession = (deckId: string) => {
    setStudyDeckId(deckId);
    setIsStudyMode(true);
  };

  // Render study session
  if (isStudyMode && studyDeckId) {
    return (
      <StudySession 
        deckId={studyDeckId}
        onBack={() => setIsStudyMode(false)}
        onComplete={() => {
          setIsStudyMode(false);
          setStudyDeckId(null);
        }}
      />
    );
  }

  // Render deck detail
  if (selectedDeckId) {
    return (
      <DeckDetail 
        deckId={selectedDeckId}
        onBack={() => setSelectedDeckId(null)}
        onStartStudy={startStudySession}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Flashcards</h1>
          <p className="text-muted-foreground">
            Create and study flashcards with spaced repetition
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search decks..."
              className="pl-9 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsCreatingDeck(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Deck
          </Button>
        </div>
      </div>

      {/* Create/Edit Deck Form */}
      {(isCreatingDeck || editingDeck) && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>{editingDeck ? "Edit Deck" : "Create New Deck"}</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  setIsCreatingDeck(false);
                  setEditingDeck(null);
                }}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DeckForm 
              deck={editingDeck || undefined}
              onSubmit={handleDeckSubmit}
              onCancel={() => {
                setIsCreatingDeck(false);
                setEditingDeck(null);
              }} 
            />
          </CardContent>
        </Card>
      )}

      {/* Main content */}
      <Tabs defaultValue="all-decks">
        <TabsList className="w-full sm:w-auto mb-4">
          <TabsTrigger value="all-decks">All Decks</TabsTrigger>
          <TabsTrigger value="due-today">Due Today</TabsTrigger>
          <TabsTrigger value="recently-studied">Recently Studied</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-decks">
          {/* Deck grid */}
          {filteredDecks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
              {searchTerm ? (
                <p className="text-muted-foreground">No decks match your search.</p>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Book className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No flashcard decks yet</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Create your first deck to start studying
                  </p>
                  <Button onClick={() => setIsCreatingDeck(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Deck
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredDecks.map((deck) => (
                <Card 
                  key={deck.id} 
                  className="overflow-hidden hover:border-primary/50 transition-colors group"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base group-hover:text-primary transition-colors">
                          {deck.title}
                        </CardTitle>
                        {deck.category && (
                          <Badge variant="outline" className="mt-1">
                            {deck.category}
                          </Badge>
                        )}
                      </div>
                      <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingDeck(deck);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDeck(deck.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{deck.description}</CardDescription>
                  </CardHeader>
                  <CardContent onClick={() => setSelectedDeckId(deck.id)} className="cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Book className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{deck.cards.length} cards</span>
                      </div>
                      {deck.cards.some(card => card.lastReviewed) && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {deck.cards
                              .filter(card => card.lastReviewed)
                              .sort((a, b) => 
                                new Date(b.lastReviewed!).getTime() - new Date(a.lastReviewed!).getTime()
                              )[0]?.lastReviewed
                              ? new Date(deck.cards
                                  .filter(card => card.lastReviewed)
                                  .sort((a, b) => 
                                    new Date(b.lastReviewed!).getTime() - new Date(a.lastReviewed!).getTime()
                                  )[0].lastReviewed!).toLocaleDateString()
                              : "Never"
                            }
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1 mb-3">
                      <div className="flex justify-between text-xs">
                        <span>Mastery</span>
                        <span className="font-medium">{deckStats[deck.id]?.mastery || 0}%</span>
                      </div>
                      <Progress value={deckStats[deck.id]?.mastery || 0} />
                    </div>
                    
                    {deckStats[deck.id]?.cardsToReview > 0 && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {deckStats[deck.id].cardsToReview} cards due
                      </Badge>
                    )}
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDeckId(deck.id);
                      }}
                    >
                      View Deck
                    </Button>
                    <Button 
                      size="sm"
                      disabled={deck.cards.length === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        startStudySession(deck.id);
                      }}
                    >
                      Study Now
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {/* Create new deck card */}
              <Card 
                className="border-dashed hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => setIsCreatingDeck(true)}
              >
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
          )}
        </TabsContent>
        
        <TabsContent value="due-today">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Cards Due for Review</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{dueCards.length} cards due today</span>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            {dueCards.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">All caught up!</h3>
                <p className="text-sm text-muted-foreground text-center">
                  No cards are due for review today
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {dueCards.map(({ deckId, deckTitle, card }) => (
                  <Card key={card.id} className="hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div>
                          <Badge variant="outline" className="mb-2">
                            {deckTitle}
                          </Badge>
                          <CardTitle className="text-base">{card.front}</CardTitle>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => startStudySession(deckId)}
                        >
                          Review
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
                
                <div className="flex justify-center">
                  <Button variant="outline">
                    Review All Due Cards
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="recently-studied">
          {recentlyStudiedDecks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">No recently studied decks</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Start studying to see your recent decks here
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentlyStudiedDecks.map((deck) => (
                <Card 
                  key={deck.id} 
                  className="overflow-hidden hover:border-primary/50 transition-colors"
                  onClick={() => setSelectedDeckId(deck.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{deck.title}</CardTitle>
                    <CardDescription>{deck.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Last studied: {new Date(Math.max(...deck.cards
                          .filter(card => card.lastReviewed)
                          .map(card => new Date(card.lastReviewed!).getTime())
                        )).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span>{deckStats[deck.id]?.mastery || 0}% mastered</span>
                    </div>
                    <Progress value={deckStats[deck.id]?.mastery || 0} className="mb-3" />
                    
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {deckStats[deck.id]?.masteredCards || 0} mastered
                      </Badge>
                      
                      {deckStats[deck.id]?.cardsToReview > 0 && (
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          {deckStats[deck.id].cardsToReview} due
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        startStudySession(deck.id);
                      }}
                    >
                      Continue Studying
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 