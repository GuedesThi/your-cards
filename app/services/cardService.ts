/* eslint-disable @typescript-eslint/no-explicit-any */
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
      creatureSubtype: c.creature_subtype,
      creatureBehavior: c.creature_behavior,
      effectTiming: c.effect_timing,
      effectDuration: c.effect_duration,
    }));
  },

  async createCard(card: Card, userId: string): Promise<Card> {
    const payload = {
      user_id: userId,
      name: card.name,
      type: card.type,
      attack: card.attack,
      defense: card.defense,
      description: card.description,
      image_url: card.imageUrl,
      scale: card.scale,
      pos_x: card.posX,
      pos_y: card.posY,
      creature_subtype: card.creatureSubtype,
      creature_behavior: card.creatureBehavior,
      effect_timing: card.effectTiming,
      effect_duration: card.effectDuration,
    };

    const { data, error } = await supabase.from("cards").insert([payload]).select();

    if (error) throw new Error(error.message);

    const c = data?.[0];
    return {
      ...card,
      id: c?.id || card.id,
      user_id: userId,
    };
  },

  async updateCard(card: Card, userId: string): Promise<Card> {
    if (!card.id) {
      throw new Error("ID da carta inválido para atualização.");
    }

    const payload = {
      name: card.name,
      type: card.type,
      attack: card.attack,
      defense: card.defense,
      description: card.description,
      image_url: card.imageUrl,
      scale: card.scale,
      pos_x: card.posX,
      pos_y: card.posY,
      creature_subtype: card.creatureSubtype,
      creature_behavior: card.creatureBehavior,
      effect_timing: card.effectTiming,
      effect_duration: card.effectDuration,
    };

    const { data, error } = await supabase
      .from("cards")
      .update(payload)
      .eq("id", card.id)
      .eq("user_id", userId) // 👈 Garante o uso do userId e elimina o aviso
      .select();

    if (error) {
      console.error("Erro no Supabase ao atualizar carta:", error.message);
      throw new Error(`Falha no banco de dados: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error(
        "A alteração não foi salva no banco. Verifique se você está autenticado corretamente."
      );
    }

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
      creatureSubtype: c.creature_subtype,
      creatureBehavior: c.creature_behavior,
      effectTiming: c.effect_timing,
      effectDuration: c.effect_duration,
    };
  },

  async deleteCard(cardId: string): Promise<void> {
    const { error } = await supabase.from("cards").delete().eq("id", cardId);
    if (error) throw new Error(error.message);
  },
};