/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import { Deck } from "../types";
import { deckService } from "../services/deckService";

export function useDecks(userId: string | undefined) {
  const [decks, setDecks] = useState<Deck[]>([]);

  const loadDecks = useCallback(async () => {
    if (!userId) {
      setDecks([]);
      return;
    }
    const data = await deckService.getDecksByUser(userId);
    setDecks(data);
  }, [userId]);

  useEffect(() => {
    loadDecks();
  }, [loadDecks]);

  const createDeck = async (name: string, description: string, imageUrl?: string) => {
    if (!userId) return;
    await deckService.createDeck({ name, description, imageUrl }, userId);
    await loadDecks();
  };

  const updateDeck = async (deckId: string, name: string, description: string, imageUrl?: string) => {
    await deckService.updateDeck(deckId, { name, description, imageUrl });
    await loadDecks();
  };

  const addCardToDeck = async (deckId: string, cardId: string, quantity: number) => {
    await deckService.addCardToDeck(deckId, cardId, quantity);
    await loadDecks();
  };

  const removeCardFromDeck = async (deckId: string, cardId: string) => {
    await deckService.removeCardFromDeck(deckId, cardId);
    await loadDecks();
  };

  const deleteDeck = async (deckId: string) => {
    await deckService.deleteDeck(deckId);
    setDecks((prev) => prev.filter((d) => d.id !== deckId));
  };

  return {
    decks,
    createDeck,
    updateDeck,
    addCardToDeck,
    removeCardFromDeck,
    deleteDeck,
    reloadDecks: loadDecks,
  };
}