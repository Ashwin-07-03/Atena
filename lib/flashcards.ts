import { v4 as uuidv4 } from 'uuid';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed: string | null;
  nextReview: string | null;
  streak: number;
  createdAt: string;
  updatedAt: string;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  cards: Flashcard[];
}

// Get all decks from local storage
export const getDecks = (): Deck[] => {
  if (typeof window === 'undefined') return [];
  
  const decksJson = localStorage.getItem('flashcard-decks');
  if (!decksJson) return [];
  
  try {
    return JSON.parse(decksJson);
  } catch (e) {
    console.error('Failed to parse decks from localStorage', e);
    return [];
  }
};

// Save all decks to local storage
export const saveDecks = (decks: Deck[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('flashcard-decks', JSON.stringify(decks));
};

// Create a new deck
export const createDeck = (title: string, description: string, category: string): Deck => {
  const newDeck: Deck = {
    id: uuidv4(),
    title,
    description,
    category,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cards: [],
  };
  
  const decks = getDecks();
  saveDecks([...decks, newDeck]);
  
  return newDeck;
};

// Get a specific deck by ID
export const getDeck = (deckId: string): Deck | undefined => {
  const decks = getDecks();
  return decks.find(deck => deck.id === deckId);
};

// Update a deck
export const updateDeck = (deckId: string, updates: Partial<Omit<Deck, 'id' | 'createdAt' | 'cards'>>): Deck | undefined => {
  const decks = getDecks();
  const deckIndex = decks.findIndex(deck => deck.id === deckId);
  
  if (deckIndex === -1) return undefined;
  
  const updatedDeck = {
    ...decks[deckIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  decks[deckIndex] = updatedDeck;
  saveDecks(decks);
  
  return updatedDeck;
};

// Delete a deck
export const deleteDeck = (deckId: string): boolean => {
  const decks = getDecks();
  const updatedDecks = decks.filter(deck => deck.id !== deckId);
  
  if (updatedDecks.length === decks.length) return false;
  
  saveDecks(updatedDecks);
  return true;
};

// Add a flashcard to a deck
export const addFlashcard = (deckId: string, front: string, back: string, difficulty: Flashcard['difficulty'] = 'medium'): Flashcard | undefined => {
  const decks = getDecks();
  const deckIndex = decks.findIndex(deck => deck.id === deckId);
  
  if (deckIndex === -1) return undefined;
  
  const newCard: Flashcard = {
    id: uuidv4(),
    front,
    back,
    difficulty,
    lastReviewed: null,
    nextReview: null,
    streak: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  decks[deckIndex].cards.push(newCard);
  decks[deckIndex].updatedAt = new Date().toISOString();
  saveDecks(decks);
  
  return newCard;
};

// Update a flashcard
export const updateFlashcard = (deckId: string, cardId: string, updates: Partial<Omit<Flashcard, 'id' | 'createdAt'>>): Flashcard | undefined => {
  const decks = getDecks();
  const deckIndex = decks.findIndex(deck => deck.id === deckId);
  
  if (deckIndex === -1) return undefined;
  
  const cardIndex = decks[deckIndex].cards.findIndex(card => card.id === cardId);
  
  if (cardIndex === -1) return undefined;
  
  const updatedCard = {
    ...decks[deckIndex].cards[cardIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  decks[deckIndex].cards[cardIndex] = updatedCard;
  decks[deckIndex].updatedAt = new Date().toISOString();
  saveDecks(decks);
  
  return updatedCard;
};

// Delete a flashcard
export const deleteFlashcard = (deckId: string, cardId: string): boolean => {
  const decks = getDecks();
  const deckIndex = decks.findIndex(deck => deck.id === deckId);
  
  if (deckIndex === -1) return false;
  
  const originalLength = decks[deckIndex].cards.length;
  decks[deckIndex].cards = decks[deckIndex].cards.filter(card => card.id !== cardId);
  
  if (decks[deckIndex].cards.length === originalLength) return false;
  
  decks[deckIndex].updatedAt = new Date().toISOString();
  saveDecks(decks);
  return true;
};

// Calculate deck statistics
export const getDeckStats = (deckId: string): {
  totalCards: number;
  masteredCards: number;
  cardsToReview: number;
  mastery: number;
} => {
  const deck = getDeck(deckId);
  
  if (!deck) {
    return {
      totalCards: 0,
      masteredCards: 0,
      cardsToReview: 0,
      mastery: 0
    };
  }

  const totalCards = deck.cards.length;
  const masteredCards = deck.cards.filter(card => card.streak >= 5).length;
  
  // Cards due for review today
  const today = new Date().toISOString().split('T')[0];
  const cardsToReview = deck.cards.filter(card => {
    if (!card.nextReview) return true; // Never reviewed
    return card.nextReview.split('T')[0] <= today;
  }).length;
  
  const mastery = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;
  
  return {
    totalCards,
    masteredCards,
    cardsToReview,
    mastery
  };
};

// Get all cards due for review today
export const getCardsToReview = (): { deckId: string, deckTitle: string, card: Flashcard }[] => {
  const decks = getDecks();
  const today = new Date().toISOString().split('T')[0];
  
  return decks.flatMap(deck => 
    deck.cards
      .filter(card => {
        if (!card.nextReview) return true; // Never reviewed
        return card.nextReview.split('T')[0] <= today;
      })
      .map(card => ({
        deckId: deck.id,
        deckTitle: deck.title,
        card
      }))
  );
};

// Calculate next review date based on spaced repetition algorithm
export const calculateNextReview = (card: Flashcard, performanceRating: 1 | 2 | 3 | 4 | 5): string => {
  let newStreak = card.streak;
  
  // Update streak based on performance
  if (performanceRating >= 4) {
    newStreak += 1;
  } else if (performanceRating <= 2) {
    newStreak = Math.max(0, newStreak - 1);
  }
  
  // Calculate days until next review based on streak and performance
  let daysUntilNextReview = 1;
  
  if (newStreak === 0) {
    daysUntilNextReview = 1;
  } else if (newStreak === 1) {
    daysUntilNextReview = 2;
  } else if (newStreak === 2) {
    daysUntilNextReview = 4;
  } else if (newStreak === 3) {
    daysUntilNextReview = 7;
  } else if (newStreak === 4) {
    daysUntilNextReview = 14;
  } else {
    daysUntilNextReview = 30;
  }
  
  // Adjust based on performance
  if (performanceRating <= 2) {
    daysUntilNextReview = 1; // Review again tomorrow if performance was poor
  } else if (performanceRating === 3) {
    daysUntilNextReview = Math.max(1, Math.floor(daysUntilNextReview * 0.7)); // Slightly sooner
  } else if (performanceRating === 5) {
    daysUntilNextReview = Math.floor(daysUntilNextReview * 1.5); // Even longer if excellent
  }
  
  // Calculate the next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + daysUntilNextReview);
  
  return nextReviewDate.toISOString();
}; 