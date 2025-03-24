"use client";

import { useState } from "react";
import { Flashcard } from "@/lib/flashcards";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface FlashcardProps {
  card: Flashcard;
  onEdit?: () => void;
  onDelete?: () => void;
  showControls?: boolean;
  disableFlip?: boolean;
}

export function FlashcardDisplay({
  card,
  onEdit,
  onDelete,
  showControls = true,
  disableFlip = false,
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    if (!disableFlip) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div className="w-full perspective">
      <div
        className={`relative w-full aspect-[3/2] rounded-lg shadow-md transition-all duration-500 transform ${
          isFlipped ? "rotate-y-180" : ""
        } cursor-pointer select-none`}
        onClick={handleCardClick}
      >
        {/* Front of card */}
        <div
          className={`absolute inset-0 backface-hidden bg-card border rounded-lg flex flex-col p-6 ${
            isFlipped ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="flex-1 flex items-center justify-center text-center">
            <p className="text-lg font-medium">{card.front}</p>
          </div>
          <div className="text-xs text-muted-foreground text-center pt-4">
            Click to flip
          </div>
          
          {showControls && (
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
          
          <div className="absolute bottom-2 left-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              card.difficulty === 'easy' 
                ? 'bg-green-100 text-green-800' 
                : card.difficulty === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
            }`}>
              {card.difficulty}
            </span>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={`absolute inset-0 backface-hidden bg-card border rounded-lg flex flex-col p-6 rotate-y-180 ${
            isFlipped ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex-1 overflow-auto">
            <p className="text-base">{card.back}</p>
          </div>
          <div className="text-xs text-muted-foreground text-center pt-4">
            Click to flip back
          </div>
        </div>
      </div>
    </div>
  );
}

// Add CSS for the card flip animation to global.css
// .perspective { perspective: 1000px; }
// .backface-hidden { backface-visibility: hidden; }
// .rotate-y-180 { transform: rotateY(180deg); }
// .preserve-3d { transform-style: preserve-3d; } 