/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { Card } from "../types";

interface CardRenderProps {
  card: Card;
  onShowMore: (desc: string) => void;
}

export function CardRender({ card, onShowMore }: CardRenderProps) {
  const isCreature = card.type === "creature" || (card.type as string) === "combat";

  const textRef = useRef<HTMLParagraphElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const hasOverflow =
          textRef.current.scrollHeight > textRef.current.clientHeight;
        setIsOverflowing(hasOverflow);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [card.description, isCreature]);

  const getSubtypeLabel = () => {
    if (isCreature) {
      switch (card.creatureSubtype) {
        case "evolution":
          return "Evolução";
        case "summon":
          return "Invocação";
        default:
          return "Normal";
      }
    } else {
      switch (card.effectTiming) {
        case "instant":
          return "Instantâneo";
        case "conditional":
          return "Condição";
        default:
          return "Turno";
      }
    }
  };

  const getBehaviorLabel = () => {
    if (isCreature) {
      switch (card.creatureBehavior) {
        case "defense":
          return "🛡️ Defesa";
        case "quick_attack":
          return "⚡ Ataque Rápido";
        case "first_strike":
          return "🗡️ Primeiro Toque";
        case "patient":
          return "🧘 Paciente";
        default:
          return "Padrão";
      }
    } else {
      switch (card.effectDuration) {
        case "continuous":
          return "🔄 Contínuo";
        default:
          return "💥 Único";
      }
    }
  };

  return (
    <div
      style={{
        width: "280px",
        height: "420px",
        borderRadius: "16px",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        border: "1px solid rgba(212, 175, 55, 0.35)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
        color: "#fff",
        userSelect: "none",
        backgroundColor: "#0a0a0f",
      }}
    >
      {/* 🔮 CAMADA DE AMBIENTAÇÃO */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        {card.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={card.imageUrl}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "blur(16px) brightness(0.4)",
              transform: "scale(1.2)",
            }}
          />
        )}
      </div>

      {/* 🖼️ QUADRO DA ARTE */}
      <div
        style={{
          position: "absolute",
          inset: "8px",
          borderRadius: "12px",
          overflow: "hidden",
          zIndex: 1,
          border: "1px solid rgba(212, 175, 55, 0.4)",
          boxShadow: "inset 0 0 12px rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
              objectFit: "contain",
              transform: `scale(${card.scale || 1}) translate(${card.posX || 0}px, ${card.posY || 0}px)`,
              transition: "transform 0.1s ease-out",
            }}
            onError={(e: any) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
            Sem Imagem
          </div>
        )}
      </div>

      {/* 🏷️ HEADER DA CARTA */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(10, 10, 15, 0.75)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          padding: "3px 8px",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
        }}
      >
        <span
          className="font-cinzel"
          style={{
            fontWeight: "bold",
            fontSize: "12px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "160px",
            textShadow: "0 2px 4px rgba(0,0,0,0.8)",
          }}
        >
          {card.name || "Nova Carta"}
        </span>
        <span
          style={{
            fontSize: "9px",
            padding: "1px 6px",
            borderRadius: "8px",
            fontWeight: "bold",
            textTransform: "uppercase",
            background: isCreature ? "#e74c3c" : "#2980b9",
            boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          {isCreature ? "Criatura" : "Efeito"}
        </span>
      </div>

      {/* 📜 ÁREA INFERIOR */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
          {/* BARRA DE CATEGORIA */}
          <div
            style={{
              position: "relative",
              zIndex: 5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "rgba(10, 10, 15, 0.85)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              padding: "4px 8px",
              borderRadius: "8px",
              border: "1px solid rgba(212, 175, 55, 0.4)",
              fontSize: "10px",
              fontWeight: "bold",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              minHeight: "22px",
              boxSizing: "border-box",
            }}
          >
            {/* Lado Esquerdo: Categoria e Comportamento */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ color: "var(--gold-glow)" }}>{getSubtypeLabel()}</span>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>•</span>
              <span style={{ color: "#e0e0e0" }}>{getBehaviorLabel()}</span>
            </div>

            {/* Lado Direito: Insígnias Maioradas e Flutuantes */}
            {isCreature && (
              <div
                style={{
                  position: "absolute",
                  right: "6px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  zIndex: 10,
                }}
              >
                {/* Insígnia de Ataque */}
                <div
                  title="Ataque"
                  style={{
                    width: "26px", // 👈 Aumentado de 22px para 26px
                    height: "26px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #c70039, #900c3f)",
                    border: "2px double var(--gold-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px", // 👈 Fonte 12px
                    fontWeight: "bold",
                    color: "#fff",
                    boxShadow: "0 3px 8px rgba(0, 0, 0, 0.9)",
                    textShadow: "0 1px 2px #000",
                    transform: "scale(1.1)",
                  }}
                >
                  {card.attack || 0}
                </div>

                {/* Insígnia de Defesa */}
                <div
                  title="Defesa"
                  style={{
                    width: "26px", // 👈 Aumentado de 22px para 26px
                    height: "26px",
                    borderRadius: "30% 30% 50% 50%",
                    background: "linear-gradient(135deg, #1f4068, #162447)",
                    border: "1px solid rgba(255,255,255,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#fff",
                    boxShadow: "0 3px 8px rgba(0, 0, 0, 0.9)",
                    textShadow: "0 1px 2px #000",
                    transform: "scale(1.1)",
                  }}
                >
                  {card.defense || 0}
                </div>
              </div>
            )}
          </div>

          {/* PAINEL DE DESCRIÇÃO */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              width: "97%",
              margin: "0 auto",
              marginTop: "-1px",
              background: "rgba(10, 10, 15, 0.80)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              padding: "12px 10px 8px 10px", // 👈 paddingTop: 12px para dar recuo ao texto em relação às bolinhas
              borderRadius: "8px",
              height: isCreature ? "85px" : "105px",
              fontSize: "11px",
              lineHeight: "1.3",
              overflow: "hidden",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
            }}
          >
            <p
              ref={textRef}
              style={{
                display: "-webkit-box",
                WebkitLineClamp: isCreature ? 4 : 5,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                margin: 0,
              }}
            >
              {card.description || "Sem descrição."}
            </p>

            {isOverflowing && (
              <button
                onClick={() => onShowMore(card.description)}
                style={{
                  position: "absolute",
                  bottom: "4px",
                  right: "6px",
                  background: "var(--gold-primary)",
                  color: "#000",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "9px",
                  fontWeight: "bold",
                  padding: "2px 6px",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
                }}
              >
                Mostrar tudo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}