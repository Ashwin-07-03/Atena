"use client";

import { useState, useEffect } from "react";
import { Deck, Flashcard, getDeck, getDeckStats, deleteFlashcard } from "@/lib/flashcards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlashcardDisplay } from "@/components/flashcards/card";
import { CardForm } from "@/components/flashcards/card-form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Book, 
  Calendar, 
  ClockIcon, 
  Trophy,
  PlayCircle,
  Settings,
  X,
  Grid3X3
} from "lucide-react";

interface DeckDetailProps {
  deckId: string;
  onBack: () => void;
  onStartStudy: (deckId: string) => void;
}

export function DeckDetail({ deckId, onBack, onStartStudy }: DeckDetailProps) {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [stats, setStats] = useState({
    totalCards: 0,
    masteredCards: 0,
    cardsToReview: 0,
    mastery: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);

  // Load deck and stats
  useEffect(() => {
    const loadDeck = () => {
      const deckData = getDeck(deckId);
      if (deckData) {
        setDeck(deckData);
        const deckStats = getDeckStats(deckId);
        setStats(deckStats);
      }
    };

    loadDeck();
    
    // Set up a window event listener to reload data when localStorage changes
    const handleStorageChange = () => loadDeck();
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [deckId]);

  if (!deck) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">Loading deck...</p>
      </div>
    );
  }

  // Filter cards by search term
  const filteredCards = deck.cards.filter(card => 
    card.front.toLowerCase().includes(searchTerm.toLowerCase()) || 
    card.back.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardSubmit = () => {
    setIsAddingCard(false);
    setEditingCard(null);
    
    // Trigger a storage event to reload the deck
    window.dispatchEvent(new Event("storage"));
  };

  const handleDeleteCard = (cardId: string) => {
    if (window.confirm("Are you sure you want to delete this flashcard?")) {
      deleteFlashcard(deckId, cardId);
      // Trigger a storage event to reload the deck
      window.dispatchEvent(new Event("storage"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{deck.title}</h1>
            <p className="text-muted-foreground">{deck.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => onStartStudy(deckId)}
            disabled={deck.cards.length === 0}
          >
            <PlayCircle className="mr-2 h-4 w-4" />
            Study Now
          </Button>
          <Button onClick={() => setIsAddingCard(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Card
          </Button>
        </div>
      </div>

      {/* Stats and Search */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="p-4">
            <CardDescription>Total Cards</CardDescription>
            <CardTitle className="text-3xl">{stats.totalCards}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="p-4">
            <CardDescription>Due for Review</CardDescription>
            <CardTitle className="text-3xl">{stats.cardsToReview}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="p-4">
            <CardDescription>Mastered</CardDescription>
            <CardTitle className="text-3xl">{stats.masteredCards}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="p-4">
            <CardDescription>Mastery Level</CardDescription>
            <div className="flex items-center gap-2">
              <CardTitle className="text-3xl">{stats.mastery}%</CardTitle>
              <Trophy className="h-5 w-5 text-yellow-500" />
            </div>
            <Progress value={stats.mastery} className="mt-2" />
          </CardHeader>
        </Card>
      </div>

      {/* Add Card Form */}
      {isAddingCard && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Add New Flashcard</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsAddingCard(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CardForm 
              deckId={deckId} 
              onSubmit={handleCardSubmit} 
              onCancel={() => setIsAddingCard(false)} 
            />
          </CardContent>
        </Card>
      )}

      {/* Edit Card Form */}
      {editingCard && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Edit Flashcard</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setEditingCard(null)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CardForm 
              deckId={deckId}
              card={editingCard}
              onSubmit={handleCardSubmit} 
              onCancel={() => setEditingCard(null)} 
            />
          </CardContent>
        </Card>
      )}

      {/* Tabs and Card List */}
      <Tabs defaultValue="all-cards">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="all-cards">All Cards</TabsTrigger>
            <TabsTrigger value="due-cards">Due for Review</TabsTrigger>
            <TabsTrigger value="mastered">Mastered</TabsTrigger>
          </TabsList>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cards..."
              className="pl-9 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="all-cards">
          {filteredCards.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 border rounded-lg">
              {searchTerm ? (
                <p className="text-muted-foreground">No cards match your search</p>
              ) : (
                <>
                  <Book className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">No flashcards in this deck yet</p>
                  <Button onClick={() => setIsAddingCard(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Card
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCards.map((card) => (
                <FlashcardDisplay
                  key={card.id}
                  card={card}
                  onEdit={() => setEditingCard(card)}
                  onDelete={() => handleDeleteCard(card.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="due-cards">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCards.filter(card => {
              if (!card.nextReview) return true; // Never reviewed
              const today = new Date().toISOString().split('T')[0];
              return card.nextReview.split('T')[0] <= today;
            }).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 border rounded-lg col-span-full">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No cards due for review</p>
              </div>
            ) : (
              filteredCards.filter(card => {
                if (!card.nextReview) return true; // Never reviewed
                const today = new Date().toISOString().split('T')[0];
                return card.nextReview.split('T')[0] <= today;
              }).map((card) => (
                <FlashcardDisplay
                  key={card.id}
                  card={card}
                  onEdit={() => setEditingCard(card)}
                  onDelete={() => handleDeleteCard(card.id)}
                />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="mastered">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCards.filter(card => card.streak >= 5).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 border rounded-lg col-span-full">
                <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No mastered cards yet</p>
              </div>
            ) : (
              filteredCards.filter(card => card.streak >= 5).map((card) => (
                <FlashcardDisplay
                  key={card.id}
                  card={card}
                  onEdit={() => setEditingCard(card)}
                  onDelete={() => handleDeleteCard(card.id)}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 