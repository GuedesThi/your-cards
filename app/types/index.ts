export type CardType = "combat" | "effect";

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
  created_at?: string;
}

export type AuthMode = "login" | "register" | "forgot";

export type ActiveTab = "landing" | "creator" | "library" | "auth";