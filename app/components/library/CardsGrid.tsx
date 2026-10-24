/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from "../../types";
import { CardRender } from "../CardRender";

interface CardsGridProps {
  user: any;
  cards: Card[];
  onShowModal: (desc: string) => void;
  onEditCard: (card: Card) => void;
  onDeleteCard: (card: Card) => void;
}

export function CardsGrid({
  user,
  cards,
  onShowModal,
  onEditCard,
  onDeleteCard,
}: CardsGridProps) {
  if (cards.length === 0) {
    return (
      <p style={{ color: "var(--text-muted)" }}>
        Nenhuma carta encontrada na sua conta. Acesse o menu &quot;Criar Carta&quot; para começar!
      </p>
    );
  }

  return (
    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
      {cards.map((card) => (
        <div key={card.id} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <CardRender card={card} onShowMore={onShowModal} />
          {user && (
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => onEditCard(card)}
                style={{
                  flex: 1,
                  background: "rgba(243, 156, 18, 0.15)",
                  border: "1px solid var(--gold-primary)",
                  color: "var(--gold-glow)",
                  padding: "6px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                ✏️ Editar
              </button>
              <button
                onClick={() => onDeleteCard(card)}
                style={{
                  flex: 1,
                  background: "rgba(231, 76, 60, 0.15)",
                  border: "1px solid var(--combat-red)",
                  color: "#ff8a80",
                  padding: "6px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                🗑️ Excluir
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}