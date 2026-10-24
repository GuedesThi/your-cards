export type CardType = "creature" | "effect";

// Subtipos e Comportamentos para Criaturas
export type CreatureSubtype = "normal" | "evolution" | "summon";
export type CreatureBehavior = "defense" | "quick_attack" | "first_strike" | "patient";

// Subtipos e Duração para Efeitos
export type EffectTiming = "instant" | "turn" | "conditional";
export type EffectDuration = "single" | "continuous";

export interface Card {
  id?: string;
  user_id?: string;
  name: string;
  type: CardType;
  attack: number;
  defense: number;
  description: string;
  imageUrl: string;
  scale: number;
  posX: number;
  posY: number;
  creatureSubtype?: CreatureSubtype;
  creatureBehavior?: CreatureBehavior;
  effectTiming?: EffectTiming;
  effectDuration?: EffectDuration;
  created_at?: string;
}

export type AuthMode = "login" | "register" | "forgot";
export type ActiveTab = "landing" | "creator" | "library" | "auth" | "profile";

export interface Deck {
  id?: string;
  user_id?: string;
  name: string;
  description?: string;
  imageUrl?: string; // 👈 URL da capa do deck
  cards?: { card: Card; quantity: number }[];
  created_at?: string;
}

export interface UserProfile {
  id: string;
  email?: string;
  username?: string;
  avatarUrl?: string;
}