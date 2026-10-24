/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from "../../types";
import { CardRender } from "../CardRender";
import "./CardsGrid.css";

interface CardsGridProps {
  user: any;
  cards: Card[];
  onShowModal: (desc: string) => void;
  onEditCard: (card: Card) => void;
  onDeleteCard: (card: Card) => void;
}

export function CardsGrid({ user, cards, onShowModal, onEditCard, onDeleteCard }: CardsGridProps) {
  if (cards.length === 0) {
    return (
      <p style={{ color: "var(--text-muted)", textAlign: "center" }}>
        Nenhuma carta encontrada na sua conta. Acesse o menu &quot;Criar Carta&quot; para começar!
      </p>
    );
  }

  return (
    <div className="cg-grid">
      {cards.map((card) => (
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
  );
}