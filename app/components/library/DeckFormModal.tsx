/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Deck } from "../../types";
import "./DeckFormModal.css";

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
    <div className="df-modal-overlay">
      <div className="df-modal-content">
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
          className="df-modal-input"
        />

        <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
          URL do Ícone / Capa (PNG/JPG):
        </label>
        <input
          type="text"
          value={deckImageUrl}
          onChange={(e) => setDeckImageUrl(e.target.value)}
          placeholder="https://exemplo.com/escudo.png"
          className="df-modal-input"
        />

        <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
          Descrição:
        </label>
        <textarea
          value={deckDesc}
          onChange={(e) => setDeckDesc(e.target.value)}
          placeholder="Escreva sobre a estratégia ou tema do deck..."
          className="df-modal-input df-modal-textarea"
        />

        <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: "transparent",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "8px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            style={{
              flex: 1,
              background: "var(--gold-primary)",
              color: "#000",
              border: "none",
              padding: "8px",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {editingDeck ? "Atualizar Deck" : "Salvar Deck"}
          </button>
        </div>
      </div>
    </div>
  );
}