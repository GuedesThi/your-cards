import { useState, useEffect, useCallback } from "react";
import { Card } from "../types";
import { cardService } from "../services/cardService";

export function useCards(userId: string | undefined) {
  const [cards, setCards] = useState<Card[]>([]);

  const loadCards = useCallback(async () => {
    if (!userId) {
      setCards([]);
      return;
    }
    const data = await cardService.getCardsByUser(userId);
    setCards(data);
  }, [userId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCards();
  }, [loadCards]);

  const addCard = async (newCard: Card) => {
    if (!userId) throw new Error("Usuário não autenticado");
    const savedCard = await cardService.createCard(newCard, userId);
    if (savedCard) {
      setCards((prev) => [savedCard, ...prev]);
    }
    return savedCard;
  };

  return { cards, addCard, reloadCards: loadCards };
}