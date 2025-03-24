"use client";

import { useState, useEffect } from "react";
import { Flashcard, Deck, getDeck, updateFlashcard, calculateNextReview } from "@/lib/flashcards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FlashcardDisplay } from "@/components/flashcards/card";
import { ArrowLeft, X, CheckCircle2, Clock, RotateCw } from "lucide-react";

interface StudySessionProps {
  deckId: string;
  onBack: () => void;
  onComplete: () => void;
}

export function StudySession({ deckId, onBack, onComplete }: StudySessionProps) {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cardsToStudy, setCardsToStudy] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [stats, setStats] = useState({
    cardsReviewed: 0,
    easyRatings: 0,
    mediumRatings: 0,
    hardRatings: 0
  });

  // Load deck data
  useEffect(() => {
    const deckData = getDeck(deckId);
    if (deckData) {
      setDeck(deckData);
      
      // Prioritize cards due for review and cards with lower streak counts
      const cards = [...deckData.cards].sort((a, b) => {
        // First prioritize unreviewed cards
        if (!a.nextReview && b.nextReview) return -1;
        if (a.nextReview && !b.nextReview) return 1;
        
        // Then prioritize cards due for review
        if (a.nextReview && b.nextReview) {
          const aDate = new Date(a.nextReview);
          const bDate = new Date(b.nextReview);
          if (aDate < bDate) return -1;
          if (aDate > bDate) return 1;
        }
        
        // Then cards with lower streak counts
        return a.streak - b.streak;
      });
      
      // Limit to 10 cards per study session
      setCardsToStudy(cards.slice(0, 10));
    }
  }, [deckId]);

  const handleRating = (rating: 1 | 2 | 3 | 4 | 5) => {
    if (!deck || currentCardIndex >= cardsToStudy.length) return;
    
    const card = cardsToStudy[currentCardIndex];
    const nextReview = calculateNextReview(card, rating);
    
    // Update streak based on performance
    let newStreak = card.streak;
    if (rating >= 4) {
      newStreak += 1;
    } else if (rating <= 2) {
      newStreak = Math.max(0, newStreak - 1);
    }
    
    // Update card in database
    updateFlashcard(deckId, card.id, {
      lastReviewed: new Date().toISOString(),
      nextReview,
      streak: newStreak
    });
    
    // Update stats
    setStats(prev => ({
      ...prev,
      cardsReviewed: prev.cardsReviewed + 1,
      easyRatings: rating >= 4 ? prev.easyRatings + 1 : prev.easyRatings,
      mediumRatings: rating === 3 ? prev.mediumRatings + 1 : prev.mediumRatings,
      hardRatings: rating <= 2 ? prev.hardRatings + 1 : prev.hardRatings
    }));
    
    // Move to next card
    if (currentCardIndex < cardsToStudy.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsCardFlipped(false);
    } else {
      setSessionComplete(true);
    }
  };

  if (!deck || cardsToStudy.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">Loading study session...</p>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Study Session Complete!</CardTitle>
          <CardDescription>
            You've completed your study session for {deck.title}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Cards Reviewed</p>
              <p className="text-2xl font-semibold">{stats.cardsReviewed}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Easy Ratings</p>
              <p className="text-2xl font-semibold text-green-500">{stats.easyRatings}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Hard Ratings</p>
              <p className="text-2xl font-semibold text-red-500">{stats.hardRatings}</p>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Deck
            </Button>
            <Button onClick={onComplete}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Finish
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentCard = cardsToStudy[currentCardIndex];
  const progress = Math.round(((currentCardIndex) / cardsToStudy.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{deck.title}</h1>
            <p className="text-muted-foreground text-sm">Studying card {currentCardIndex + 1} of {cardsToStudy.length}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onBack}>
          <X className="mr-2 h-4 w-4" />
          End Session
        </Button>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-full max-w-xl mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="w-full max-w-xl">
          <FlashcardDisplay 
            card={currentCard}
            showControls={false}
            disableFlip={false}
          />
          
          <div className="mt-8 flex flex-col gap-4">
            {!isCardFlipped ? (
              <Button 
                className="mx-auto" 
                onClick={() => setIsCardFlipped(true)}
              >
                <RotateCw className="mr-2 h-4 w-4" />
                Reveal Answer
              </Button>
            ) : (
              <div className="space-y-4">
                <p className="text-center text-muted-foreground text-sm">How well did you know this?</p>
                
                <div className="flex justify-center gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleRating(1)}
                  >
                    Not at all
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1 border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600"
                    onClick={() => handleRating(2)}
                  >
                    Hard
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1 border-yellow-500 text-yellow-500 hover:bg-yellow-50 hover:text-yellow-600"
                    onClick={() => handleRating(3)}
                  >
                    Good
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1 border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"
                    onClick={() => handleRating(4)}
                  >
                    Easy
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1 border-emerald-500 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600"
                    onClick={() => handleRating(5)}
                  >
                    Perfect
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 