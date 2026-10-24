/* eslint-disable @typescript-eslint/no-explicit-any */
import { Deck } from "../../types";
import "./DecksGrid.css";

interface DecksGridProps {
  decks: Deck[];
  onSelectDeck: (deck: Deck) => void;
  onEditDeck: (deck: Deck) => void;
  onDeleteDeck: (deckId: string) => void;
}

export function DecksGrid({ decks, onSelectDeck, onEditDeck, onDeleteDeck }: DecksGridProps) {
  if (decks.length === 0) {
    return (
      <p style={{ color: "var(--text-muted)", textAlign: "center" }}>
        Você ainda não criou nenhum deck. Clique em &quot;Criar Novo Deck&quot; acima para começar!
      </p>
    );
  }

  return (
    <div className="dg-grid">
      {decks.map((deck) => (
        <div key={deck.id} className="dg-card">
          <div>
            <div className="dg-card__header">
              {deck.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={deck.imageUrl}
                  alt=""
                  className="dg-card__img"
                  onError={(e: any) => { e.target.style.display = "none"; }}
                />
              ) : (
                <span style={{ fontSize: "20px" }}>📦</span>
              )}
              <h3 className="font-cinzel dg-card__title">{deck.name}</h3>
            </div>

            <p className="dg-card__desc">{deck.description || "Sem descrição."}</p>
            <p style={{ color: "#fff", fontSize: "12px", fontWeight: "bold" }}>
              Cartas no Deck: {deck.cards?.reduce((acc, curr) => acc + curr.quantity, 0) || 0}
            </p>
          </div>

          <div className="dg-card__actions">
            <button onClick={() => onSelectDeck(deck)} className="dg-card__btn-access">
              👁️ Acessar Deck
            </button>
            <div className="dg-card__icons">
              <button onClick={() => onEditDeck(deck)} title="Editar Deck" className="dg-card__btn-edit">
                ✏️
              </button>
              <button onClick={() => deck.id && onDeleteDeck(deck.id)} title="Excluir Deck" className="dg-card__btn-delete">
                🗑️
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}