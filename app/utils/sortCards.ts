import { Card, SortOption } from "../types";

export function sortCards(cards: Card[], option: SortOption): Card[] {
  const list = [...cards];

  switch (option) {
    case "recent":
      // Reverte a ordem ou usa ID/posição padrão (os últimos criados ficam primeiro)
      return list.reverse();

    case "oldest":
      return list;

    case "name_asc":
      return list.sort((a, b) => a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" }));

    case "name_desc":
      return list.sort((a, b) => b.name.localeCompare(a.name, "pt-BR", { sensitivity: "base" }));

    case "attack_desc":
      return list.sort((a, b) => {
        const isACreature = a.type === "creature";
        const isBCreature = b.type === "creature";
        if (isACreature && isBCreature) {
          return (b.attack || 0) - (a.attack || 0);
        }
        if (isACreature) return -1;
        if (isBCreature) return 1;
        return 0; // Mantém ordem original de criação para efeitos
      });

    case "defense_desc":
      return list.sort((a, b) => {
        const isACreature = a.type === "creature";
        const isBCreature = b.type === "creature";
        if (isACreature && isBCreature) {
          return (b.defense || 0) - (a.defense || 0);
        }
        if (isACreature) return -1;
        if (isBCreature) return 1;
        return 0; // Mantém ordem original de criação para efeitos
      });

    case "category": {
      const order = { normal: 1, evolution: 2, summon: 3 };
      return list.sort((a, b) => {
        const isACreature = a.type === "creature";
        const isBCreature = b.type === "creature";
        if (isACreature && isBCreature) {
          const valA = order[a.creatureSubtype || "normal"] || 99;
          const valB = order[b.creatureSubtype || "normal"] || 99;
          return valA - valB;
        }
        if (isACreature) return -1;
        if (isBCreature) return 1;
        return 0; // Efeitos no final por criação
      });
    }

    case "behavior": {
      const order = { defense: 1, quick_attack: 2, first_strike: 3, patient: 4 };
      return list.sort((a, b) => {
        const isACreature = a.type === "creature";
        const isBCreature = b.type === "creature";
        if (isACreature && isBCreature) {
          const valA = order[a.creatureBehavior || "defense"] || 99;
          const valB = order[b.creatureBehavior || "defense"] || 99;
          return valA - valB;
        }
        if (isACreature) return -1;
        if (isBCreature) return 1;
        return 0; // Efeitos no final por criação
      });
    }

    case "type":
      return list.sort((a, b) => {
        if (a.type === b.type) return 0;
        return a.type === "creature" ? -1 : 1;
      });

    case "effect_timing": {
      const order = { turn: 1, instant: 2, conditional: 3 };
      return list.sort((a, b) => {
        const isAEffect = a.type === "effect";
        const isBEffect = b.type === "effect";
        if (isAEffect && isBEffect) {
          const valA = order[a.effectTiming || "turn"] || 99;
          const valB = order[b.effectTiming || "turn"] || 99;
          return valA - valB;
        }
        if (isAEffect) return -1;
        if (isBEffect) return 1;
        return 0; // Criaturas no final por criação
      });
    }

    case "effect_duration": {
      const order = { single: 1, continuous: 2 };
      return list.sort((a, b) => {
        const isAEffect = a.type === "effect";
        const isBEffect = b.type === "effect";
        if (isAEffect && isBEffect) {
          const valA = order[a.effectDuration || "single"] || 99;
          const valB = order[b.effectDuration || "single"] || 99;
          return valA - valB;
        }
        if (isAEffect) return -1;
        if (isBEffect) return 1;
        return 0; // Criaturas no final por criação
      });
    }

    default:
      return list;
  }
}