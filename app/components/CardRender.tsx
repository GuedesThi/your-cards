/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { Card } from "../types";
import "./CardRender.css";

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
        const hasOverflow = textRef.current.scrollHeight > textRef.current.clientHeight;
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
        case "evolution": return "Evolução";
        case "summon": return "Invocação";
        default: return "Normal";
      }
    } else {
      switch (card.effectTiming) {
        case "instant": return "Instantâneo";
        case "conditional": return "Condição";
        default: return "Turno";
      }
    }
  };

  const getBehaviorLabel = () => {
    if (isCreature) {
      switch (card.creatureBehavior) {
        case "defense": return "🛡️ Defesa";
        case "quick_attack": return "⚡ Ataque Rápido";
        case "first_strike": return "🗡️ Primeiro Toque";
        case "patient": return "🧘 Paciente";
        default: return "Padrão";
      }
    } else {
      switch (card.effectDuration) {
        case "continuous": return "🔄 Contínuo";
        default: return "💥 Único";
      }
    }
  };

  return (
    <div className="crd-card">
      <div className="crd-card__ambient">
        {card.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={card.imageUrl} alt="" className="crd-card__ambient-img" />
        )}
      </div>

      <div className="crd-card__frame">
        {card.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={card.imageUrl}
            alt={card.name}
            className="crd-card__img"
            style={{
              transform: `scale(${card.scale || 1}) translate(${card.posX || 0}px, ${card.posY || 0}px)`,
            }}
            onError={(e: any) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div className="crd-card__no-img">Sem Imagem</div>
        )}
      </div>

      <div className="crd-card__header">
        <span className="font-cinzel crd-card__title">
          {card.name || "Nova Carta"}
        </span>
        <span className={`crd-card__badge ${isCreature ? "crd-card__badge--creature" : "crd-card__badge--effect"}`}>
          {isCreature ? "Criatura" : "Efeito"}
        </span>
      </div>

      <div className="crd-card__bottom">
        <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
          <div className="crd-card__cat-bar">
            <div className="crd-card__cat-left">
              <span style={{ color: "var(--gold-glow)" }}>{getSubtypeLabel()}</span>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>•</span>
              <span style={{ color: "#e0e0e0" }}>{getBehaviorLabel()}</span>
            </div>

            {isCreature && (
              <div className="crd-card__stats">
                <div title="Ataque" className="crd-card__atk">{card.attack || 0}</div>
                <div title="Defesa" className="crd-card__def">{card.defense || 0}</div>
              </div>
            )}
          </div>

          <div className={`crd-card__desc-panel ${isCreature ? "crd-card__desc-panel--creature" : "crd-card__desc-panel--effect"}`}>
            <p ref={textRef} className={`crd-card__desc-text ${isCreature ? "crd-card__clamp--creature" : "crd-card__clamp--effect"}`}>
              {card.description || "Sem descrição."}
            </p>

            {isOverflowing && (
              <button onClick={() => onShowMore(card.description)} className="crd-card__more-btn">
                Mostrar tudo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}