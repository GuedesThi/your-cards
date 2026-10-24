/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Deck } from "../../types";
import { CardRender } from "../CardRender";

interface DeckDetailViewProps {
  user: any;
  deck: Deck;
  allCards: Card[];
  onBack: () => void;
  onEditDeck: (deck: Deck) => void;
  onEditCard: (card: Card, deckId?: string) => void;
  onRemoveCardFromDeck: (deckId: string, cardId: string) => Promise<void>;
  onAddCardToDeck: (deckId: string, cardId: string, qty: number) => Promise<void>;
  onShowModal: (desc: string) => void;
}

export function DeckDetailView({
  user,
  deck,
  allCards,
  onBack,
  onEditDeck,
  onEditCard,
  onRemoveCardFromDeck,
  onAddCardToDeck,
  onShowModal,
}: DeckDetailViewProps) {
  const deckCardIds = (deck.cards || []).map((dc) => dc.card.id);
  const availableCardsToAdd = allCards.filter((c) => !deckCardIds.includes(c.id));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <button onClick={onBack} style={goldOutlineBtnStyle}>
          ← Voltar para Lista de Decks
        </button>

        <button onClick={() => onEditDeck(deck)} style={goldSecondaryBtnStyle}>
          ✏️ Editar Informações do Deck
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
        {deck.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={deck.imageUrl} alt="" style={{ width: "32px", height: "32px", borderRadius: "6px", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: "24px" }}>📦</span>
        )}
        <h3 className="font-cinzel" style={{ color: "var(--gold-primary)", fontSize: "22px", margin: 0 }}>
          {deck.name}
        </h3>
      </div>

      <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px" }}>
        {deck.description || "Sem descrição."}
      </p>

      <h4 style={{ color: "#fff", marginBottom: "12px" }}>Cartas no Deck ({deck.cards?.length || 0})</h4>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "32px" }}>
        {(deck.cards || []).map(({ card, quantity }) => (
          <div key={card.id} style={{ display: "flex", flexDirection: "column", gap: "8px", position: "relative" }}>
            <CardRender card={card} onShowMore={onShowModal} />
            <div style={badgeStyle}>x{quantity}</div>
            {user && (
              <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={() => onEditCard(card, deck.id)} style={goldSecondaryBtnStyle}>
                  ✏️ Editar
                </button>
                <button
                  onClick={() => card.id && deck.id && onRemoveCardFromDeck(deck.id, card.id)}
                  style={redOutlineBtnStyle}
                >
                  Remover
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px dashed rgba(212, 175, 55, 0.3)" }}>
        <h4 style={{ color: "var(--gold-primary)", marginBottom: "16px" }}>Adicionar Cartas da Coleção ao Deck</h4>

        {availableCardsToAdd.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            Todas as cartas da sua coleção já foram adicionadas a este deck!
          </p>
        ) : (
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {availableCardsToAdd.map((card) => (
              <div key={card.id} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <CardRender card={card} onShowMore={onShowModal} />
                <div style={{ display: "flex", gap: "6px" }}>
                  <button onClick={() => onEditCard(card, deck.id)} style={goldSecondaryBtnStyle} title="Editar Carta">
                    ✏️
                  </button>
                  <button
                    onClick={() => card.id && deck.id && onAddCardToDeck(deck.id, card.id, 1)}
                    style={primaryBtnStyle}
                  >
                    ➕ Adicionar ao Deck
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const badgeStyle = {
  position: "absolute" as const,
  top: "12px",
  right: "12px",
  background: "var(--gold-primary)",
  color: "#000",
  fontWeight: "bold",
  borderRadius: "50%",
  width: "28px",
  height: "28px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 8px #000",
  zIndex: 10,
};

const goldOutlineBtnStyle = {
  background: "transparent",
  color: "var(--gold-primary)",
  border: "1px solid var(--gold-primary)",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

const goldSecondaryBtnStyle = {
  background: "rgba(243, 156, 18, 0.2)",
  border: "1px solid var(--gold-primary)",
  color: "var(--gold-glow)",
  padding: "6px 12px",
  borderRadius: "6px",
  fontWeight: "bold",
  fontSize: "12px",
  cursor: "pointer",
};

const redOutlineBtnStyle = {
  flex: 1,
  background: "rgba(231, 76, 60, 0.2)",
  border: "1px solid #e74c3c",
  color: "#ff8a80",
  padding: "6px",
  borderRadius: "6px",
  fontSize: "12px",
  cursor: "pointer",
  fontWeight: "bold",
};

const primaryBtnStyle = {
  flex: 1,
  background: "linear-gradient(135deg, var(--gold-primary), #d4af37)",
  color: "#000",
  border: "none",
  padding: "8px",
  borderRadius: "6px",
  fontWeight: "bold",
  fontSize: "12px",
  cursor: "pointer",
};