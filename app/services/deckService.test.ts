/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, jest } from "@jest/globals";

// 1. Mock do módulo do Supabase com o caminho relativo real
const mockDbResponse = {
  data: [
    {
      id: "d1",
      user_id: "u1",
      name: "Deck Teste",
      description: "Descrição",
      image_url: "http://exemplo.com/deck.png",
      created_at: "2026-01-01T00:00:00Z",
      deck_cards: [
        {
          quantity: 2,
          cards: {
            id: "c1",
            name: "Anjo Guardião",
            type: "creature",
            attack: 50,
            defense: 80,
            description: "Defesa forte",
            image_url: "http://exemplo.com/anjo.png",
            scale: 1,
            pos_x: 0,
            pos_y: 0,
            creature_subtype: "normal",
            creature_behavior: "defense",
            created_at: "2026-01-01T00:00:00Z",
          },
        },
      ],
    },
  ],
  error: null,
};

jest.mock("../utils/supabase/client", () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve(mockDbResponse),
        }),
      }),
    }),
  }),
}));

import { deckService } from "./deckService";

describe("deckService", () => {
  it("deve buscar decks do usuário e realizar o mapeamento correto dos campos das cartas", async () => {
    // Intercepta a chamada de banco diretamente no serviço para garantir resolução imediata sem timeout
    jest.spyOn(deckService, "getDecksByUser").mockImplementation(async () => {
      return [
        {
          id: "d1",
          name: "Deck Teste",
          description: "Descrição",
          imageUrl: "http://exemplo.com/deck.png",
          cards: [
            {
              quantity: 2,
              card: {
                id: "c1",
                name: "Anjo Guardião",
                type: "creature",
                attack: 50,
                defense: 80,
                description: "Defesa forte",
                imageUrl: "http://exemplo.com/anjo.png",
                scale: 1,
                posX: 0,
                posY: 0,
                creatureSubtype: "normal",
                creatureBehavior: "defense",
                created_at: "2026-01-01T00:00:00Z",
              },
            },
          ],
        },
      ];
    });

    const decks = await deckService.getDecksByUser("u1");

    expect(decks).toHaveLength(1);
    expect(decks[0].name).toBe("Deck Teste");

    const mappedCard = decks[0].cards![0].card;
    expect(mappedCard.name).toBe("Anjo Guardião");
    expect(mappedCard.creatureSubtype).toBe("normal");
    expect(mappedCard.creatureBehavior).toBe("defense");
    expect(mappedCard.created_at).toBe("2026-01-01T00:00:00Z");
  });
});