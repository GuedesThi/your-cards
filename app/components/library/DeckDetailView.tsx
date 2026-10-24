/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card, Deck, SortOption } from "../../types";
import { CardRender } from "../CardRender";
import { sortCards } from "../../utils/sortCards";
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
  const [sortOption, setSortOption] = useState<SortOption>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("deckSortOption") as SortOption | null;
      if (saved) return saved;
    }
    return "recent";
  });

  const handleSortChange = (newOption: SortOption) => {
    setSortOption(newOption);
    localStorage.setItem("deckSortOption", newOption);
  };

  const deckCardsOnly = (deck.cards || []).map((dc) => dc.card);
  const sortedDeckCards = sortCards(deckCardsOnly, sortOption);

  const deckCardIds = (deck.cards || []).map((dc) => dc.card.id);
  const availableCardsToAdd = allCards.filter((c) => !deckCardIds.includes(c.id));
  const sortedAvailableCards = sortCards(availableCardsToAdd, sortOption);

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

      {/* Controles de Ordenação no Deck */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
        <h4 style={{ color: "#fff", margin: 0 }}>Cartas no Deck ({deck.cards?.length || 0})</h4>
        
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", color: "var(--gold-glow)", fontWeight: "bold" }}>Filtrar Deck:</span>
          <select
            value={sortOption}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            style={{
              background: "rgba(0, 0, 0, 0.7)",
              color: "#fff",
              border: "1px solid var(--border-gold)",
              padding: "6px 10px",
              borderRadius: "6px",
              fontSize: "12px",
            }}
          >
            <option value="recent">📅 Adição (Mais Recentes Primeiro)</option>
            <option value="oldest">📅 Adição (Mais Antigas Primeiro)</option>
            <option value="name_asc">🔤 Nome (A-Z)</option>
            <option value="name_desc">🔤 Nome (Z-A)</option>
            <option value="attack_desc">⚔️ Maior Ataque</option>
            <option value="defense_desc">🛡️ Maior Defesa</option>
            <option value="category">🐉 Categoria de Criatura</option>
            <option value="behavior">⚔️ Comportamento</option>
            <option value="type">🃏 Tipo (Criaturas &gt; Efeitos)</option>
            <option value="effect_timing">✨ Momento de Uso (Efeitos)</option>
            <option value="effect_duration">⏳ Duração do Efeito</option>
          </select>
        </div>
      </div>

      <div className="dd-view__grid">
        {sortedDeckCards.map((card) => {
          const deckItem = (deck.cards || []).find((dc) => dc.card.id === card.id);
          const quantity = deckItem?.quantity || 1;

          return (
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
          );
        })}
      </div>

      <div className="dd-view__suggestion-area">
        <h4 style={{ color: "var(--gold-primary)", marginBottom: "16px", textAlign: "center" }}>
          Adicionar Cartas da Coleção ao Deck
        </h4>

        {sortedAvailableCards.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "13px", textAlign: "center" }}>
            Todas as cartas da sua coleção já foram adicionadas a este deck!
          </p>
        ) : (
          <div className="dd-view__grid">
            {sortedAvailableCards.map((card) => (
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