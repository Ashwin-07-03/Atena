"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flashcard, addFlashcard, updateFlashcard } from "@/lib/flashcards";

interface CardFormProps {
  deckId: string;
  card?: Flashcard;
  onSubmit: (card: Flashcard) => void;
  onCancel: () => void;
}

export function CardForm({ deckId, card, onSubmit, onCancel }: CardFormProps) {
  const [front, setFront] = useState(card?.front || "");
  const [back, setBack] = useState(card?.back || "");
  const [difficulty, setDifficulty] = useState<Flashcard["difficulty"]>(
    card?.difficulty || "medium"
  );
  const [errors, setErrors] = useState<{
    front?: string;
    back?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: {
      front?: string;
      back?: string;
    } = {};
    
    if (!front.trim()) {
      newErrors.front = "Question is required";
    }
    
    if (!back.trim()) {
      newErrors.back = "Answer is required";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Create or update card
    let result: Flashcard | undefined;
    
    if (card) {
      result = updateFlashcard(deckId, card.id, { front, back, difficulty });
    } else {
      result = addFlashcard(deckId, front, back, difficulty);
    }
    
    if (result) {
      onSubmit(result);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="front">Question (Front)</Label>
        <Input
          id="front"
          value={front}
          onChange={(e) => setFront(e.target.value)}
          placeholder="Enter the question or prompt"
          className={errors.front ? "border-destructive" : ""}
        />
        {errors.front && (
          <p className="text-sm text-destructive">{errors.front}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="back">Answer (Back)</Label>
        <textarea
          id="back"
          value={back}
          onChange={(e) => setBack(e.target.value)}
          placeholder="Enter the answer or explanation"
          className={`w-full min-h-[100px] px-3 py-2 border rounded-md ${
            errors.back ? "border-destructive" : "border-input"
          } bg-transparent text-sm`}
        />
        {errors.back && (
          <p className="text-sm text-destructive">{errors.back}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label>Difficulty</Label>
        <div className="flex gap-2">
          {(["easy", "medium", "hard"] as const).map((level) => (
            <Button
              key={level}
              type="button"
              variant={difficulty === level ? "default" : "outline"}
              onClick={() => setDifficulty(level)}
              className="flex-1 capitalize"
            >
              {level}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {card ? "Update Card" : "Add Card"}
        </Button>
      </div>
    </form>
  );
} 