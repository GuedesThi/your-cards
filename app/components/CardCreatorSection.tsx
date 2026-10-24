/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Card,
  CreatureSubtype,
  CreatureBehavior,
  EffectTiming,
  EffectDuration,
} from "../types";
import { CardRender } from "./CardRender";
import { NotificationModal } from "./NotificationModal";
import { GameGlossary } from "./GameGlossary";

interface CardCreatorSectionProps {
  user: any;
  editingCard: Card | null;
  onSaveCard: (card: Card) => Promise<void>;
  onShowModal: (desc: string) => void;
  onRequireAuth: () => void;
  onCancelEdit?: () => void;
}

const initialFormState: Card = {
  name: "",
  type: "creature",
  attack: 5,
  defense: 5,
  description: "",
  imageUrl: "",
  scale: 1.0,
  posX: 0,
  posY: 0,
  creatureSubtype: "normal",
  creatureBehavior: "defense",
  effectTiming: "turn",
  effectDuration: "single",
};

export function CardCreatorSection({
  user,
  editingCard,
  onSaveCard,
  onShowModal,
  onRequireAuth,
  onCancelEdit,
}: CardCreatorSectionProps) {
  const [cardForm, setCardForm] = useState<Card>(editingCard || initialFormState);

  useEffect(() => {
    if (editingCard) {
      setCardForm(editingCard);
    } else {
      setCardForm(initialFormState);
    }
  }, [editingCard?.id]);

  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    title: string;
    message: string;
    action?: () => void;
  } | null>(null);

  const handleSave = async () => {
    if (!user) {
      setNotification({
        type: "info",
        title: "Acesso Necessário",
        message: "Você precisa estar logado para salvar suas cartas na biblioteca!",
        action: onRequireAuth,
      });
      return;
    }

    if (!cardForm.name.trim()) {
      setNotification({
        type: "error",
        title: "Campo Obrigatório",
        message: "Por favor, digite um nome para a sua carta.",
      });
      return;
    }

    if (!cardForm.description.trim()) {
      setNotification({
        type: "error",
        title: "Campo Obrigatório",
        message: "Sua carta precisa de uma descrição para explicar seus efeitos ou habilidades.",
      });
      return;
    }

    if (!cardForm.imageUrl.trim()) {
      setNotification({
        type: "error",
        title: "Imagem Necessária",
        message: "Forneça uma URL de imagem válida para ilustrar sua carta.",
      });
      return;
    }

    try {
      const payload: Card = {
        ...cardForm,
        attack: cardForm.type === "effect" ? 0 : cardForm.attack,
        defense: cardForm.type === "effect" ? 0 : cardForm.defense,
      };

      await onSaveCard(payload);

      setNotification({
        type: "success",
        title: cardForm.id ? "Carta Atualizada!" : "Carta Forjada com Sucesso!",
        message: `Sua carta "${cardForm.name}" foi gravada com segurança na sua biblioteca.`,
      });

      if (!cardForm.id) {
        setCardForm(initialFormState);
      }
    } catch (err: any) {
      setNotification({
        type: "error",
        title: "Falha ao Salvar Carta",
        message: err.message || "Ocorreu um erro inesperado ao se comunicar com o banco de dados.",
      });
    }
  };

  return (
    <div>
      <div
        className="creator-container"
        style={{
          display: "flex",
          gap: "32px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/* Painel do Formulário */}
        <div
          className="creator-form"
          style={{
            flex: "1 1 380px",
            background: "var(--panel-bg)",
            padding: "24px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h3 className="font-cinzel" style={{ color: "var(--gold-primary)", fontSize: "18px" }}>
              {cardForm.id ? "Editar Carta" : "Personalizar Carta"}
            </h3>
            {cardForm.id && onCancelEdit && (
              <button
                onClick={() => {
                  setCardForm(initialFormState);
                  onCancelEdit();
                }}
                style={{
                  background: "transparent",
                  color: "var(--text-muted)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  fontSize: "11px",
                  cursor: "pointer",
                }}
              >
                Cancelar Edição
              </button>
            )}
          </div>

          <label style={labelStyle}>Nome da Carta: *</label>
          <input
            type="text"
            style={inputStyle}
            value={cardForm.name}
            onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
            placeholder="Ex: Guardião de Ouro"
          />

          <label style={labelStyle}>Tipo:</label>
          <select
            style={inputStyle}
            value={cardForm.type}
            onChange={(e) => setCardForm({ ...cardForm, type: e.target.value as any })}
          >
            <option value="creature">Criatura</option>
            <option value="effect">Efeito</option>
          </select>

          {cardForm.type === "creature" ? (
            <>
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Categoria:</label>
                  <select
                    style={inputStyle}
                    value={cardForm.creatureSubtype || "normal"}
                    onChange={(e) =>
                      setCardForm({
                        ...cardForm,
                        creatureSubtype: e.target.value as CreatureSubtype,
                      })
                    }
                  >
                    <option value="normal">Normal</option>
                    <option value="evolution">Evolução</option>
                    <option value="summon">Invocação</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Comportamento:</label>
                  <select
                    style={inputStyle}
                    value={cardForm.creatureBehavior || "defense"}
                    onChange={(e) =>
                      setCardForm({
                        ...cardForm,
                        creatureBehavior: e.target.value as CreatureBehavior,
                      })
                    }
                  >
                    <option value="defense">Defesa</option>
                    <option value="quick_attack">Ataque Rápido</option>
                    <option value="first_strike">Primeiro Toque</option>
                    <option value="patient">Paciente</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Ataque:</label>
                  <input
                    type="number"
                    style={inputStyle}
                    value={cardForm.attack}
                    onChange={(e) =>
                      setCardForm({
                        ...cardForm,
                        attack: parseInt(e.target.value) || 0,
                      })
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
                      setCardForm({
                        ...cardForm,
                        defense: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Momento de Uso:</label>
                <select
                  style={inputStyle}
                  value={cardForm.effectTiming || "turn"}
                  onChange={(e) =>
                    setCardForm({
                      ...cardForm,
                      effectTiming: e.target.value as EffectTiming,
                    })
                  }
                >
                  <option value="turn">Efeito de Turno</option>
                  <option value="instant">Efeito Instantâneo</option>
                  <option value="conditional">Efeito de Condição</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Duração:</label>
                <select
                  style={inputStyle}
                  value={cardForm.effectDuration || "single"}
                  onChange={(e) =>
                    setCardForm({
                      ...cardForm,
                      effectDuration: e.target.value as EffectDuration,
                    })
                  }
                >
                  <option value="single">Efeito Único</option>
                  <option value="continuous">Efeito Contínuo</option>
                </select>
              </div>
            </div>
          )}

          <label style={labelStyle}>URL da Imagem: *</label>
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
              min="0.2"
              max="3.0"
              step="0.05"
              value={cardForm.scale}
              onChange={(e) =>
                setCardForm({ ...cardForm, scale: parseFloat(e.target.value) })
              }
              style={{ width: "100%", accentColor: "var(--gold-primary)" }}
            />

            <label style={labelStyle}>Posição Horizontal (X): ({cardForm.posX}px)</label>
            <input
              type="range"
              min="-200"
              max="200"
              value={cardForm.posX}
              onChange={(e) =>
                setCardForm({ ...cardForm, posX: parseInt(e.target.value) })
              }
              style={{ width: "100%", accentColor: "var(--gold-primary)" }}
            />

            <label style={labelStyle}>Posição Vertical (Y): ({cardForm.posY}px)</label>
            <input
              type="range"
              min="-200"
              max="200"
              value={cardForm.posY}
              onChange={(e) =>
                setCardForm({ ...cardForm, posY: parseInt(e.target.value) })
              }
              style={{ width: "100%", accentColor: "var(--gold-primary)" }}
            />
          </div>

          <label style={labelStyle}>Descrição da Habilidade / Efeito: *</label>
          <textarea
            style={{ ...inputStyle, height: "80px", resize: "vertical" }}
            value={cardForm.description}
            onChange={(e) => setCardForm({ ...cardForm, description: e.target.value })}
            placeholder="Escreva os efeitos ou a história da sua carta..."
          />

          <button onClick={handleSave} style={primaryBtnStyle}>
            {cardForm.id ? "Atualizar Carta ✏️" : "Salvar na Biblioteca 💾"}
          </button>
        </div>

        {/* Pré-visualização em Tempo Real */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h3 className="font-cinzel" style={{ color: "var(--text-muted)", marginBottom: "16px" }}>
            Pré-visualização em Tempo Real
          </h3>
          <CardRender card={cardForm} onShowMore={onShowModal} />
        </div>
      </div>

      <GameGlossary />

      {notification && (
        <NotificationModal
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => {
            const action = notification.action;
            setNotification(null);
            if (action) action();
          }}
        />
      )}
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