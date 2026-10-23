import { useState } from "react";
import { Card } from "../types";
import { CardRender } from "./CardRender";

interface CardCreatorSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  onSaveCard: (card: Card) => Promise<void>;
  onShowModal: (desc: string) => void;
  onRequireAuth: () => void;
}

export function CardCreatorSection({
  user,
  onSaveCard,
  onShowModal,
  onRequireAuth,
}: CardCreatorSectionProps) {
  const [cardForm, setCardForm] = useState<Card>({
    name: "",
    type: "combat",
    attack: 5,
    defense: 5,
    description: "",
    imageUrl: "",
    scale: 1.0,
    posX: 0,
    posY: 0,
  });

  const handleSave = async () => {
    if (!user) {
      alert("Você precisa estar logado para salvar suas cartas no banco de dados!");
      onRequireAuth();
      return;
    }
    try {
      await onSaveCard(cardForm);
      alert("Carta salva no banco com sucesso!");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert("Erro ao salvar carta: " + err.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "32px",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          flex: "1 1 380px",
          background: "var(--panel-bg)",
          padding: "24px",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}
      >
        <h3
          className="font-cinzel"
          style={{
            color: "var(--gold-primary)",
            marginBottom: "16px",
            fontSize: "18px",
          }}
        >
          Personalizar Carta
        </h3>

        <label style={labelStyle}>Nome da Carta:</label>
        <input
          type="text"
          style={inputStyle}
          value={cardForm.name}
          onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
          placeholder="Ex: Dragão Obscuro"
        />

        <label style={labelStyle}>Tipo:</label>
        <select
          style={inputStyle}
          value={cardForm.type}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={(e) => setCardForm({ ...cardForm, type: e.target.value as any })}
        >
          <option value="combat">Combate</option>
          <option value="effect">Efeito</option>
        </select>

        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Ataque:</label>
            <input
              type="number"
              style={inputStyle}
              value={cardForm.attack}
              onChange={(e) =>
                setCardForm({ ...cardForm, attack: parseInt(e.target.value) || 0 })
              }
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Defesa:</label>
            <input
              type="number"
              style={inputStyle}
              value={cardForm.defense}
              onChange={(e) =>
                setCardForm({ ...cardForm, defense: parseInt(e.target.value) || 0 })
              }
            />
          </div>
        </div>

        <label style={labelStyle}>URL da Imagem:</label>
        <input
          type="text"
          style={inputStyle}
          placeholder="https://exemplo.com/imagem.png"
          value={cardForm.imageUrl}
          onChange={(e) => setCardForm({ ...cardForm, imageUrl: e.target.value })}
        />

        <div
          style={{
            background: "rgba(0,0,0,0.4)",
            padding: "14px",
            borderRadius: "8px",
            margin: "14px 0",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <label style={labelStyle}>Zoom / Escala: ({cardForm.scale}x)</label>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.1"
            value={cardForm.scale}
            onChange={(e) =>
              setCardForm({ ...cardForm, scale: parseFloat(e.target.value) })
            }
            style={{ width: "100%", accentColor: "var(--gold-primary)" }}
          />

          <label style={labelStyle}>Posição Horizontal (X): ({cardForm.posX}px)</label>
          <input
            type="range"
            min="-100"
            max="100"
            value={cardForm.posX}
            onChange={(e) =>
              setCardForm({ ...cardForm, posX: parseInt(e.target.value) })
            }
            style={{ width: "100%", accentColor: "var(--gold-primary)" }}
          />

          <label style={labelStyle}>Posição Vertical (Y): ({cardForm.posY}px)</label>
          <input
            type="range"
            min="-100"
            max="100"
            value={cardForm.posY}
            onChange={(e) =>
              setCardForm({ ...cardForm, posY: parseInt(e.target.value) })
            }
            style={{ width: "100%", accentColor: "var(--gold-primary)" }}
          />
        </div>

        <label style={labelStyle}>Descrição da Habilidade:</label>
        <textarea
          style={{ ...inputStyle, height: "80px", resize: "vertical" }}
          value={cardForm.description}
          onChange={(e) => setCardForm({ ...cardForm, description: e.target.value })}
          placeholder="Escreva os efeitos ou a história da sua carta..."
        />

        <button onClick={handleSave} style={primaryBtnStyle}>
          Salvar na Biblioteca 💾
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h3 className="font-cinzel" style={{ color: "var(--text-muted)", marginBottom: "16px" }}>
          Pré-visualização em Tempo Real
        </h3>
        <CardRender card={cardForm} onShowMore={onShowModal} />
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: "12px",
  color: "var(--text-muted)",
  marginTop: "10px",
  marginBottom: "4px",
};

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: "6px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(0,0,0,0.5)",
  color: "#fff",
  fontSize: "14px",
};

const primaryBtnStyle = {
  background: "linear-gradient(135deg, var(--gold-primary), #d4af37)",
  color: "#000",
  border: "none",
  padding: "12px 24px",
  borderRadius: "8px",
  fontWeight: "bold" as const,
  fontSize: "15px",
  cursor: "pointer",
  width: "100%",
  marginTop: "16px",
};