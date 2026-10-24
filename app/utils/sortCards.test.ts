import { describe, it, expect } from "@jest/globals";
import { sortCards } from "./sortCards";
import { Card } from "../types";

const mockCards: Card[] = [
  {
    id: "1",
    name: "Dragão de Ouro",
    type: "creature",
    attack: 80,
    defense: 60,
    description: "Um dragão colossal",
    imageUrl: "http://example.com/1.png",
    scale: 1,
    posX: 0,
    posY: 0,
    creatureSubtype: "normal",
    creatureBehavior: "quick_attack",
    created_at: "2026-01-01T10:00:00Z",
  },
  {
    id: "2",
    name: "Anjo Protetor",
    type: "creature",
    attack: 40,
    defense: 90,
    description: "Um anjo guardião",
    imageUrl: "http://example.com/2.png",
    scale: 1,
    posX: 0,
    posY: 0,
    creatureSubtype: "evolution",
    creatureBehavior: "defense",
    created_at: "2026-01-02T10:00:00Z",
  },
  {
    id: "3",
    name: "Escudo Mágico",
    type: "effect",
    attack: 0,
    defense: 0,
    description: "Aumenta a defesa",
    imageUrl: "http://example.com/3.png",
    scale: 1,
    posX: 0,
    posY: 0,
    effectTiming: "instant",
    effectDuration: "single",
    created_at: "2026-01-03T10:00:00Z",
  },
];

describe("sortCards Utility", () => {
  it("deve ordenar por adição mais recente (recência de criação)", () => {
    const sorted = sortCards(mockCards, "recent");
    expect(sorted[0].id).toBe("3");
    expect(sorted[1].id).toBe("2");
    expect(sorted[2].id).toBe("1");
  });

  it("deve ordenar por nome em ordem alfabética A-Z", () => {
    const sorted = sortCards(mockCards, "name_asc");
    expect(sorted[0].name).toBe("Anjo Protetor");
    expect(sorted[1].name).toBe("Dragão de Ouro");
    expect(sorted[2].name).toBe("Escudo Mágico");
  });

  it("deve ordenar por maior ataque colocando cartas de efeito no final", () => {
    const sorted = sortCards(mockCards, "attack_desc");
    expect(sorted[0].name).toBe("Dragão de Ouro");
    expect(sorted[1].name).toBe("Anjo Protetor");
    expect(sorted[2].name).toBe("Escudo Mágico");
  });

  it("deve ordenar por maior defesa colocando cartas de efeito no final", () => {
    const sorted = sortCards(mockCards, "defense_desc");
    expect(sorted[0].name).toBe("Anjo Protetor");
    expect(sorted[1].name).toBe("Dragão de Ouro");
    expect(sorted[2].name).toBe("Escudo Mágico");
  });

  it("deve ordenar por tipo colocando criaturas antes de efeitos", () => {
    const sorted = sortCards(mockCards, "type");
    expect(sorted[0].type).toBe("creature");
    expect(sorted[1].type).toBe("creature");
    expect(sorted[2].type).toBe("effect");
  });
});