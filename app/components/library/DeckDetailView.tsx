/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Deck } from "../../types";
import { CardRender } from "../CardRender";
import "./DeckDetailView.css";

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
      <div className="dd-view__top-bar">
        <button onClick={onBack} className="dd-view__back-btn">
          ← Voltar para Lista de Decks
        </button>

        <button onClick={() => onEditDeck(deck)} className="dd-view__edit-deck-btn">
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

      <h4 style={{ color: "#fff", marginBottom: "16px" }}>Cartas no Deck ({deck.cards?.length || 0})</h4>

      <div className="dd-view__grid">
        {(deck.cards || []).map(({ card, quantity }) => (
          <div key={card.id} className="dd-view__card-item">
            <CardRender card={card} onShowMore={onShowModal} />
            <div className="dd-view__badge">x{quantity}</div>
            {user && (
              <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={() => onEditCard(card, deck.id)} className="dd-view__edit-deck-btn">
                  ✏️ Editar
                </button>
                <button
                  onClick={() => card.id && deck.id && onRemoveCardFromDeck(deck.id, card.id)}
                  className="dd-view__remove-btn"
                >
                  Remover
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="dd-view__suggestion-area">
        <h4 style={{ color: "var(--gold-primary)", marginBottom: "16px", textAlign: "center" }}>
          Adicionar Cartas da Coleção ao Deck
        </h4>

        {availableCardsToAdd.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "13px", textAlign: "center" }}>
            Todas as cartas da sua coleção já foram adicionadas a este deck!
          </p>
        ) : (
          <div className="dd-view__grid">
            {availableCardsToAdd.map((card) => (
              <div key={card.id} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <CardRender card={card} onShowMore={onShowModal} />
                <div style={{ display: "flex", gap: "6px" }}>
                  <button onClick={() => onEditCard(card, deck.id)} className="dd-view__edit-deck-btn" title="Editar Carta">
                    ✏️
                  </button>
                  <button
                    onClick={() => card.id && deck.id && onAddCardToDeck(deck.id, card.id, 1)}
                    className="dd-view__add-btn"
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