/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Card, CreatureSubtype, CreatureBehavior, EffectTiming, EffectDuration } from "../types";
import { CardRender } from "./CardRender";
import { NotificationModal } from "./NotificationModal";
import { GameGlossary } from "./GameGlossary";
import "./CardCreatorSection.css";

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
      <div className="crt-section">
        <div className="crt-section__panel">
          <div className="crt-section__header">
            <h3 className="font-cinzel crt-section__title">
              {cardForm.id ? "Editar Carta" : "Personalizar Carta"}
            </h3>
            {cardForm.id && onCancelEdit && (
              <button
                onClick={() => {
                  setCardForm(initialFormState);
                  onCancelEdit();
                }}
                className="crt-section__cancel-btn"
              >
                Cancelar Edição
              </button>
            )}
          </div>

          <label className="crt-section__label">Nome da Carta: *</label>
          <input
            type="text"
            className="crt-section__input"
            value={cardForm.name}
            onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
            placeholder="Ex: Guardião de Ouro"
          />

          <label className="crt-section__label">Tipo:</label>
          <select
            className="crt-section__input"
            value={cardForm.type}
            onChange={(e) => setCardForm({ ...cardForm, type: e.target.value as any })}
          >
            <option value="creature">Criatura</option>
            <option value="effect">Efeito</option>
          </select>

          {cardForm.type === "creature" ? (
            <>
              <div className="crt-section__row">
                <div className="crt-section__col">
                  <label className="crt-section__label">Categoria:</label>
                  <select
                    className="crt-section__input"
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
                <div className="crt-section__col">
                  <label className="crt-section__label">Comportamento:</label>
                  <select
                    className="crt-section__input"
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

              {/* 🎯 Barras deslizantes para Ataque e Defesa */}
              <div className="crt-section__row">
                <div className="crt-section__col">
                  <label className="crt-section__label">
                    Ataque: ({cardForm.attack || 0})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="99"
                    step="1"
                    className="crt-section__range"
                    value={cardForm.attack || 0}
                    onChange={(e) =>
                      setCardForm({
                        ...cardForm,
                        attack: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="crt-section__col">
                  <label className="crt-section__label">
                    Defesa: ({cardForm.defense || 0})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="99"
                    step="1"
                    className="crt-section__range"
                    value={cardForm.defense || 0}
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
            <div className="crt-section__row">
              <div className="crt-section__col">
                <label className="crt-section__label">Momento de Uso:</label>
                <select
                  className="crt-section__input"
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
              <div className="crt-section__col">
                <label className="crt-section__label">Duração:</label>
                <select
                  className="crt-section__input"
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

          <label className="crt-section__label">URL da Imagem: *</label>
          <input
            type="text"
            className="crt-section__input"
            placeholder="https://exemplo.com/imagem.png"
            value={cardForm.imageUrl}
            onChange={(e) => setCardForm({ ...cardForm, imageUrl: e.target.value })}
          />

          <div className="crt-section__controls">
            <label className="crt-section__label">Zoom / Escala: ({cardForm.scale}x)</label>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.05"
              value={cardForm.scale}
              onChange={(e) =>
                setCardForm({ ...cardForm, scale: parseFloat(e.target.value) })
              }
              className="crt-section__range"
            />

            <label className="crt-section__label">Posição Horizontal (X): ({cardForm.posX}px)</label>
            <input
              type="range"
              min="-200"
              max="200"
              value={cardForm.posX}
              onChange={(e) =>
                setCardForm({ ...cardForm, posX: parseInt(e.target.value) })
              }
              className="crt-section__range"
            />

            <label className="crt-section__label">Posição Vertical (Y): ({cardForm.posY}px)</label>
            <input
              type="range"
              min="-200"
              max="200"
              value={cardForm.posY}
              onChange={(e) =>
                setCardForm({ ...cardForm, posY: parseInt(e.target.value) })
              }
              className="crt-section__range"
            />
          </div>

          <label className="crt-section__label">Descrição da Habilidade / Efeito: *</label>
          <textarea
            className="crt-section__input crt-section__textarea"
            value={cardForm.description}
            onChange={(e) => setCardForm({ ...cardForm, description: e.target.value })}
            placeholder="Escreva os efeitos ou a história da sua carta..."
          />

          <button onClick={handleSave} className="crt-section__save-btn">
            {cardForm.id ? "Atualizar Carta ✏️" : "Salvar na Biblioteca 💾"}
          </button>
        </div>

        <div className="crt-section__preview">
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