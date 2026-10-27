/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card, SortOption } from "../../types";
import { CardRender } from "../CardRender";
import { sortCards } from "../../utils/sortCards";
import "./CardsGrid.css";

interface CardsGridProps {
  user: any;
  cards: Card[];
  onShowModal: (desc: string) => void;
  onEditCard: (card: Card) => void;
  onDeleteCard: (card: Card) => Promise<void> | void;
}

export function CardsGrid({ user, cards, onShowModal, onEditCard, onDeleteCard }: CardsGridProps) {
  const [sortOption, setSortOption] = useState<SortOption>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("librarySortOption") as SortOption | null;
      if (saved) return saved;
    }
    return "recent";
  });

  const handleSortChange = (newOption: SortOption) => {
    setSortOption(newOption);
    localStorage.setItem("librarySortOption", newOption);
  };

  if (cards.length === 0) {
    return (
      <p style={{ color: "var(--text-muted)", textAlign: "center" }}>
        Nenhuma carta encontrada na sua conta. Acesse o menu &quot;Criar Carta&quot; para começar!
      </p>
    );
  }

  const sortedCards = sortCards(cards, sortOption);

  return (
    <div className="cg-container">
      {/* Barra do Filtro */}
      <div className="cg-filter-bar">
        <label className="cg-filter-label">Ordenar por:</label>
        <select
          value={sortOption}
          onChange={(e) => handleSortChange(e.target.value as SortOption)}
          className="cg-filter-select"
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

      {/* Exibição das Cartas Ordenadas */}
      <div className="cg-grid">
        {sortedCards.map((card) => (
          <div key={card.id} className="cg-grid__item">
            <CardRender card={card} onShowMore={onShowModal} />
            {user && (
              <div className="cg-grid__actions">
                <button onClick={() => onEditCard(card)} className="cg-grid__btn-edit">
                  ✏️ Editar
                </button>
                <button onClick={() => onDeleteCard(card)} className="cg-grid__btn-delete">
                  🗑️ Excluir
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}