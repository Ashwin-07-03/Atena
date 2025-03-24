"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Deck, createDeck, updateDeck } from "@/lib/flashcards";

interface DeckFormProps {
  deck?: Deck;
  onSubmit: (deck: Deck) => void;
  onCancel: () => void;
}

export function DeckForm({ deck, onSubmit, onCancel }: DeckFormProps) {
  const [title, setTitle] = useState(deck?.title || "");
  const [description, setDescription] = useState(deck?.description || "");
  const [category, setCategory] = useState(deck?.category || "");
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: {
      title?: string;
      description?: string;
    } = {};
    
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Create or update deck
    let result: Deck | undefined;
    
    if (deck) {
      result = updateDeck(deck.id, { title, description, category });
    } else {
      result = createDeck(title, description, category);
    }
    
    if (result) {
      onSubmit(result);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Deck Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Biology Fundamentals"
          className={errors.title ? "border-destructive" : ""}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of the deck content"
          className={errors.description ? "border-destructive" : ""}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category (Optional)</Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g., Science, Math, Languages"
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {deck ? "Update Deck" : "Create Deck"}
        </Button>
      </div>
    </form>
  );
} 