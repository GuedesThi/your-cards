/* eslint-disable @typescript-eslint/no-explicit-any */
import { Deck } from "../../types";

interface DecksGridProps {
  decks: Deck[];
  onSelectDeck: (deck: Deck) => void;
  onEditDeck: (deck: Deck) => void;
  onDeleteDeck: (deckId: string) => void;
}

export function DecksGrid({
  decks,
  onSelectDeck,
  onEditDeck,
  onDeleteDeck,
}: DecksGridProps) {
  if (decks.length === 0) {
    return (
      <p style={{ color: "var(--text-muted)" }}>
        Você ainda não criou nenhum deck. Clique em &quot;Criar Novo Deck&quot; acima para começar!
      </p>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
      {decks.map((deck) => (
        <div
          key={deck.id}
          style={{
            background: "var(--panel-bg)",
            border: "1px solid rgba(212, 175, 55, 0.3)",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              {deck.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={deck.imageUrl}
                  alt=""
                  style={{ width: "24px", height: "24px", borderRadius: "4px", objectFit: "cover" }}
                  onError={(e: any) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <span>📦</span>
              )}
              <h3 className="font-cinzel" style={{ color: "var(--gold-primary)", fontSize: "18px", margin: 0 }}>
                {deck.name}
              </h3>
            </div>

            <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "16px" }}>
              {deck.description || "Sem descrição."}
            </p>
            <p style={{ color: "#fff", fontSize: "12px", fontWeight: "bold" }}>
              Cartas: {deck.cards?.reduce((acc, curr) => acc + curr.quantity, 0) || 0}
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
            <button
              onClick={() => onSelectDeck(deck)}
              style={{
                flex: 2,
                background: "rgba(243, 156, 18, 0.2)",
                border: "1px solid var(--gold-primary)",
                color: "var(--gold-glow)",
                padding: "8px",
                borderRadius: "6px",
                fontWeight: "bold",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              👁️ Acessar Deck
            </button>
            <button
              onClick={() => onEditDeck(deck)}
              title="Editar Deck"
              style={{
                flex: 1,
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#fff",
                padding: "8px",
                borderRadius: "6px",
                fontWeight: "bold",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              ✏️
            </button>
            <button
              onClick={() => deck.id && onDeleteDeck(deck.id)}
              title="Excluir Deck"
              style={{
                background: "rgba(231, 76, 60, 0.2)",
                border: "1px solid var(--combat-red)",
                color: "#ff8a80",
                padding: "8px 12px",
                borderRadius: "6px",
                fontWeight: "bold",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}