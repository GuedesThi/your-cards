import { Card } from "../types";
import { CardRender } from "./CardRender";

interface CardLibrarySectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  cards: Card[];
  onShowModal: (desc: string) => void;
}

export function CardLibrarySection({ user, cards, onShowModal }: CardLibrarySectionProps) {
  return (
    <div>
      {!user && (
        <div
          style={{
            background: "rgba(231, 76, 60, 0.15)",
            border: "1px solid var(--combat-red)",
            padding: "14px",
            borderRadius: "8px",
            marginBottom: "24px",
            textAlign: "center",
            color: "#ff8a80",
          }}
        >
          ⚠️ <strong>Modo Visitante:</strong> Crie uma conta ou faça login para ter suas cartas salvas no banco de dados com segurança.
        </div>
      )}
      <h2
        className="font-cinzel"
        style={{
          color: "var(--gold-primary)",
          marginBottom: "24px",
          fontSize: "26px",
        }}
      >
        Sua Coleção de Cartas
      </h2>
      {cards.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>
          Nenhuma carta encontrada na sua conta. Acesse o menu &quot;Criar Carta&quot; para começar!
        </p>
      ) : (
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          {cards.map((card) => (
            <CardRender key={card.id} card={card} onShowMore={onShowModal} />
          ))}
        </div>
      )}
    </div>
  );
}