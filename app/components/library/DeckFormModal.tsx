/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Deck } from "../../types";

interface DeckFormModalProps {
  editingDeck: Deck | null;
  onClose: () => void;
  onSubmit: (name: string, description: string, imageUrl?: string) => Promise<void>;
}

export function DeckFormModal({ editingDeck, onClose, onSubmit }: DeckFormModalProps) {
  const [deckName, setDeckName] = useState(editingDeck?.name || "");
  const [deckDesc, setDeckDesc] = useState(editingDeck?.description || "");
  const [deckImageUrl, setDeckImageUrl] = useState(editingDeck?.imageUrl || "");

  useEffect(() => {
    if (editingDeck) {
      setDeckName(editingDeck.name);
      setDeckDesc(editingDeck.description || "");
      setDeckImageUrl(editingDeck.imageUrl || "");
    }
  }, [editingDeck]);

  const handleSubmit = async () => {
    if (!deckName.trim()) return;
    await onSubmit(deckName, deckDesc, deckImageUrl);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          background: "var(--panel-bg)",
          border: "1px solid var(--gold-primary)",
          padding: "24px",
          borderRadius: "12px",
          maxWidth: "420px",
          width: "90%",
        }}
      >
        <h3 className="font-cinzel" style={{ color: "var(--gold-primary)", marginBottom: "16px" }}>
          {editingDeck ? "Editar Deck" : "Criar Novo Deck"}
        </h3>

        <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
          Nome do Deck: *
        </label>
        <input
          type="text"
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
          placeholder="Ex: Real Madrid (2026)"
          style={inputStyle}
        />

        <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
          URL do Ícone / Capa (PNG/JPG):
        </label>
        <input
          type="text"
          value={deckImageUrl}
          onChange={(e) => setDeckImageUrl(e.target.value)}
          placeholder="https://exemplo.com/escudo.png"
          style={inputStyle}
        />

        <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
          Descrição:
        </label>
        <textarea
          value={deckDesc}
          onChange={(e) => setDeckDesc(e.target.value)}
          placeholder="Escreva sobre a estratégia ou tema do deck..."
          style={{ ...inputStyle, height: "60px" }}
        />

        <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
          <button onClick={onClose} style={secondaryBtnStyle}>
            Cancelar
          </button>
          <button onClick={handleSubmit} style={primaryBtnStyle}>
            {editingDeck ? "Atualizar Deck" : "Salvar Deck"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: "6px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(0,0,0,0.5)",
  color: "#fff",
  marginBottom: "12px",
};

const primaryBtnStyle = {
  flex: 1,
  background: "var(--gold-primary)",
  color: "#000",
  border: "none",
  padding: "8px",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
};

const secondaryBtnStyle = {
  flex: 1,
  background: "transparent",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.2)",
  padding: "8px",
  borderRadius: "6px",
  cursor: "pointer",
};