import { createClient } from "../utils/supabase/client";
import { Card } from "../types";

const supabase = createClient();

export const cardService = {
  async getCardsByUser(userId: string): Promise<Card[]> {
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar cartas:", error.message);
      return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data || []).map((c: any) => ({
      id: c.id,
      user_id: c.user_id,
      name: c.name,
      type: c.type,
      attack: c.attack,
      defense: c.defense,
      description: c.description,
      imageUrl: c.image_url,
      scale: c.scale,
      posX: c.pos_x,
      posY: c.pos_y,
      created_at: c.created_at,
    }));
  },

  async createCard(card: Card, userId: string): Promise<Card | null> {
    const { data, error } = await supabase
      .from("cards")
      .insert([
        {
          user_id: userId,
          name: card.name || "Nova Carta",
          type: card.type,
          attack: card.attack,
          defense: card.defense,
          description: card.description,
          image_url: card.imageUrl,
          scale: card.scale,
          pos_x: card.posX,
          pos_y: card.posY,
        },
      ])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) return null;

    const c = data[0];
    return {
      id: c.id,
      user_id: c.user_id,
      name: c.name,
      type: c.type,
      attack: c.attack,
      defense: c.defense,
      description: c.description,
      imageUrl: c.image_url,
      scale: c.scale,
      posX: c.pos_x,
      posY: c.pos_y,
    };
  },
};