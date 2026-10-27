/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "../utils/supabase/client";
import { Deck } from "../types";

const supabase = createClient();

export const deckService = {
  async getDecksByUser(userId: string): Promise<Deck[]> {
    const { data, error } = await supabase
      .from("decks")
      .select(`
        id,
        user_id,
        name,
        description,
        image_url,
        created_at,
        deck_cards (
          quantity,
          cards (*)
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar decks:", error.message);
      return [];
    }

    return (data || []).map((d: any) => ({
      id: d.id,
      user_id: d.user_id,
      name: d.name,
      description: d.description,
      imageUrl: d.image_url,
      created_at: d.created_at,
      cards: (d.deck_cards || []).map((dc: any) => ({
        quantity: dc.quantity,
        card: {
          id: dc.cards?.id,
          user_id: dc.cards?.user_id,
          name: dc.cards?.name,
          type: dc.cards?.type,
          attack: dc.cards?.attack,
          defense: dc.cards?.defense,
          description: dc.cards?.description,
          imageUrl: dc.cards?.image_url,
          scale: dc.cards?.scale,
          posX: dc.cards?.pos_x,
          posY: dc.cards?.pos_y,
          creatureSubtype: dc.cards?.creature_subtype,
          creatureBehavior: dc.cards?.creature_behavior,
          effectTiming: dc.cards?.effect_timing,
          effectDuration: dc.cards?.effect_duration,
          created_at: dc.cards?.created_at, // 🎯 Adicionado para destravar os filtros de recência do deck
        },
      })),
    }));
  },

  async createDeck(deck: { name: string; description: string; imageUrl?: string }, userId: string): Promise<Deck | null> {
    const { data, error } = await supabase
      .from("decks")
      .insert([
        {
          user_id: userId,
          name: deck.name,
          description: deck.description,
          image_url: deck.imageUrl,
        },
      ])
      .select();

    if (error) throw new Error(error.message);
    return data ? data[0] : null;
  },

  async updateDeck(deckId: string, deck: { name: string; description: string; imageUrl?: string }): Promise<void> {
    const { error } = await supabase
      .from("decks")
      .update({
        name: deck.name,
        description: deck.description,
        image_url: deck.imageUrl,
      })
      .eq("id", deckId);

    if (error) throw new Error(error.message);
  },

  async addCardToDeck(deckId: string, cardId: string, quantity: number = 1): Promise<void> {
    const { error } = await supabase.from("deck_cards").upsert(
      [
        {
          deck_id: deckId,
          card_id: cardId,
          quantity,
        },
      ],
      { onConflict: "deck_id,card_id" }
    );

    if (error) throw new Error(error.message);
  },

  async removeCardFromDeck(deckId: string, cardId: string): Promise<void> {
    const { error } = await supabase
      .from("deck_cards")
      .delete()
      .eq("deck_id", deckId)
      .eq("card_id", cardId);

    if (error) throw new Error(error.message);
  },

  async deleteDeck(deckId: string): Promise<void> {
    const { error } = await supabase.from("decks").delete().eq("id", deckId);
    if (error) throw new Error(error.message);
  },
};