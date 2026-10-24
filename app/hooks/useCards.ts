/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import { Card } from "../types";
import { cardService } from "../services/cardService";

export function useCards(userId: string | undefined) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCards = useCallback(async () => {
    if (!userId) {
      setCards([]);
      return;
    }
    setLoading(true);
    try {
      const data = await cardService.getCardsByUser(userId);
      setCards(data);
    } catch (err) {
      console.error("Erro ao carregar cartas:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const saveOrUpdateCard = async (card: Card) => {
    if (!userId) return;

    if (card.id) {
      const updatedCard = await cardService.updateCard(card, userId);
      setCards((prev) => prev.map((c) => (c.id === updatedCard.id ? updatedCard : c)));
    } else {
      const createdCard = await cardService.createCard(card, userId);
      setCards((prev) => [createdCard, ...prev]);
    }
  };

  const removeCard = async (cardId: string) => {
    await cardService.deleteCard(cardId);
    setCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  return {
    cards,
    loading,
    saveOrUpdateCard,
    removeCard,
    reloadCards: loadCards,
  };
}