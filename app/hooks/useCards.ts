/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";
import { Card } from "../types";

const supabase = createClient();

// Função auxiliar para converter do formato do banco (snake_case) para a aplicação (camelCase)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCardFromDb(dbCard: any): Card {
  return {
    id: dbCard.id,
    name: dbCard.name,
    type: dbCard.type,
    attack: dbCard.attack,
    defense: dbCard.defense,
    description: dbCard.description,
    imageUrl: dbCard.imageUrl || dbCard.image_url || "",
    scale: dbCard.scale ?? 1.0,
    posX: dbCard.posX ?? dbCard.pos_x ?? 0,
    posY: dbCard.posY ?? dbCard.pos_y ?? 0,
    creatureSubtype: dbCard.creatureSubtype || dbCard.creature_subtype || "normal",
    creatureBehavior: dbCard.creatureBehavior || dbCard.creature_behavior || "defense",
    effectTiming: dbCard.effectTiming || dbCard.effect_timing || "turn",
    effectDuration: dbCard.effectDuration || dbCard.effect_duration || "single",
    created_at: dbCard.created_at,
  };
}

// Função auxiliar para preparar o objeto para o formato que o Supabase aceita
function mapCardToDb(card: Card, userId: string) {
  return {
    user_id: userId,
    name: card.name,
    type: card.type,
    attack: card.type === "effect" ? 0 : card.attack || 0,
    defense: card.type === "effect" ? 0 : card.defense || 0,
    description: card.description,
    image_url: card.imageUrl, // mapeia para snake_case
    scale: card.scale || 1.0,
    pos_x: card.posX || 0,     // mapeia para snake_case
    pos_y: card.posY || 0,     // mapeia para snake_case
    creature_subtype: card.creatureSubtype,   // mapeia para snake_case
    creature_behavior: card.creatureBehavior, // mapeia para snake_case
    effect_timing: card.effectTiming,         // mapeia para snake_case
    effect_duration: card.effectDuration,     // mapeia para snake_case
  };
}

export function useCards(userId?: string) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCards = async () => {
    if (!userId) {
      setCards([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setCards(data.map(mapCardFromDb));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCards();
  }, [userId]);

  const saveOrUpdateCard = async (card: Card) => {
    if (!userId) return;

    const payload = mapCardToDb(card, userId);

    if (card.id) {
      // EDIÇÃO
      const { data, error } = await supabase
        .from("cards")
        .update(payload)
        .eq("id", card.id)
        .select()
        .single();

      if (error) throw error;

      const updatedCard = mapCardFromDb(data);

      setCards((prev) =>
        prev.map((item) => (item.id === card.id ? updatedCard : item))
      );
    } else {
      // CRIAÇÃO
      const { data, error } = await supabase
        .from("cards")
        .insert([payload])
        .select()
        .single();

      if (error) throw error;

      const newCard = mapCardFromDb(data);
      setCards((prev) => [...prev, newCard]);
    }
  };

  const removeCard = async (card: Card) => {
    if (!card.id) return;
    const { error } = await supabase.from("cards").delete().eq("id", card.id);
    if (!error) {
      setCards((prev) => prev.filter((item) => item.id !== card.id));
    }
  };

  return { cards, loading, saveOrUpdateCard, removeCard, reloadCards: fetchCards };
}