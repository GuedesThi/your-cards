import { Card } from "../types";

interface CardRenderProps {
  card: Card;
  onShowMore: (desc: string) => void;
}

export function CardRender({ card, onShowMore }: CardRenderProps) {
  const isCombat = card.type === "combat";
  const isLong = (card.description || "").length > 85;

  return (
    <div
      style={{
        width: "280px",
        height: "420px",
        borderRadius: "16px",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        background: isCombat
          ? "linear-gradient(135deg, #2c1212 0%, #1a0808 100%)"
          : "linear-gradient(135deg, #0e1e2d 0%, #060e17 100%)",
        border: `3px solid ${isCombat ? "#e74c3c" : "#2980b9"}`,
        boxShadow: `0 8px 24px ${isCombat ? "rgba(231, 76, 60, 0.35)" : "rgba(41, 128, 185, 0.35)"}`,
        color: "#fff",
        userSelect: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(0,0,0,0.6)",
          padding: "6px 12px",
          borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <span
          className="font-cinzel"
          style={{
            fontWeight: "bold",
            fontSize: "14px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "160px",
          }}
        >
          {card.name || "Nova Carta"}
        </span>
        <span
          style={{
            fontSize: "10px",
            padding: "2px 8px",
            borderRadius: "10px",
            fontWeight: "bold",
            textTransform: "uppercase",
            background: isCombat ? "#e74c3c" : "#2980b9",
          }}
        >
          {isCombat ? "Combate" : "Efeito"}
        </span>
      </div>

      <div
        style={{
          width: "100%",
          height: "180px",
          borderRadius: "8px",
          overflow: "hidden",
          position: "relative",
          border: "2px solid rgba(212, 175, 55, 0.5)",
          backgroundColor: "#000",
        }}
      >
        {card.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={card.imageUrl}
            alt={card.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${card.scale || 1}) translate(${card.posX || 0}px, ${card.posY || 0}px)`,
              transition: "transform 0.1s ease-out",
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError={(e: any) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#666",
              fontSize: "12px",
            }}
          >
            Sem Imagem
          </div>
        )}
      </div>

      <div
        style={{
          background: "rgba(0, 0, 0, 0.7)",
          padding: "8px 10px",
          borderRadius: "8px",
          height: "80px",
          fontSize: "11px",
          lineHeight: "1.3",
          overflow: "hidden",
          position: "relative",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <p
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {card.description || "Sem descrição."}
        </p>
        {isLong && (
          <button
            onClick={() => onShowMore(card.description)}
            style={{
              position: "absolute",
              bottom: "2px",
              right: "6px",
              background: "var(--gold-primary)",
              color: "#000",
              border: "none",
              borderRadius: "4px",
              fontSize: "9px",
              fontWeight: "bold",
              padding: "2px 6px",
              cursor: "pointer",
            }}
          >
            Mostrar tudo
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <div
          style={{
            flex: 1,
            background: "linear-gradient(to right, #900c3f, #c70039)",
            padding: "6px",
            borderRadius: "6px",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "12px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
          }}
        >
          ⚔️ ATK: {card.attack || 0}
        </div>
        <div
          style={{
            flex: 1,
            background: "linear-gradient(to right, #1f4068, #162447)",
            padding: "6px",
            borderRadius: "6px",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "12px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
          }}
        >
          🛡️ DEF: {card.defense || 0}
        </div>
      </div>
    </div>
  );
}