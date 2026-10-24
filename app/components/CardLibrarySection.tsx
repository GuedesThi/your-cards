/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Card, Deck } from "../types";
import { CardRender } from "./CardRender";
import { ConfirmModal } from "./ConfirmModal";
import { GameGlossary } from "./GameGlossary";

interface CardLibrarySectionProps {
  user: any;
  cards: Card[];
  decks: Deck[];
  initialDeckId?: string | null;
  onShowModal: (desc: string) => void;
  onEditCard: (card: Card, deckId?: string) => void;
  onDeleteCard: (cardId: string) => void;
  onCreateDeck: (name: string, description: string, imageUrl?: string) => Promise<void>;
  onUpdateDeck: (deckId: string, name: string, description: string, imageUrl?: string) => Promise<void>;
  onAddCardToDeck: (deckId: string, cardId: string, qty: number) => Promise<void>;
  onRemoveCardFromDeck: (deckId: string, cardId: string) => Promise<void>;
  onDeleteDeck: (deckId: string) => Promise<void>;
}

export function CardLibrarySection({
  user,
  cards,
  decks,
  initialDeckId,
  onShowModal,
  onEditCard,
  onDeleteCard,
  onCreateDeck,
  onUpdateDeck,
  onAddCardToDeck,
  onRemoveCardFromDeck,
  onDeleteDeck,
}: CardLibrarySectionProps) {
  const [subTab, setSubTab] = useState<"cards" | "decks">(initialDeckId ? "decks" : "cards");
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);

  useEffect(() => {
    if (initialDeckId && decks.length > 0) {
      const targetDeck = decks.find((d) => d.id === initialDeckId);
      if (targetDeck) {
        setSelectedDeck(targetDeck);
        setSubTab("decks");
      }
    }
  }, [initialDeckId, decks]);

  useEffect(() => {
    if (selectedDeck) {
      const updatedDeck = decks.find((d) => d.id === selectedDeck.id);
      if (updatedDeck) {
        setSelectedDeck(updatedDeck);
      }
    }
  }, [decks]);

  const [deletingCard, setDeletingCard] = useState<Card | null>(null);
  const [deletingDeckId, setDeletingDeckId] = useState<string | null>(null);

  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const [deckName, setDeckName] = useState("");
  const [deckDesc, setDeckDesc] = useState("");
  const [deckImageUrl, setDeckImageUrl] = useState("");
  const [showDeckModal, setShowDeckModal] = useState(false);

  const handleOpenCreateModal = () => {
    setEditingDeck(null);
    setDeckName("");
    setDeckDesc("");
    setDeckImageUrl("");
    setShowDeckModal(true);
  };

  const handleOpenEditModal = (deck: Deck) => {
    setEditingDeck(deck);
    setDeckName(deck.name);
    setDeckDesc(deck.description || "");
    setDeckImageUrl(deck.imageUrl || "");
    setShowDeckModal(true);
  };

  const handleSaveDeckSubmit = async () => {
    if (!deckName.trim()) return;

    if (editingDeck?.id) {
      await onUpdateDeck(editingDeck.id, deckName, deckDesc, deckImageUrl);
      if (selectedDeck?.id === editingDeck.id) {
        setSelectedDeck((prev) =>
          prev ? { ...prev, name: deckName, description: deckDesc, imageUrl: deckImageUrl } : null
        );
      }
    } else {
      await onCreateDeck(deckName, deckDesc, deckImageUrl);
    }

    setShowDeckModal(false);
  };

  // 🔍 Filtra as cartas da coleção excluindo as que já estão no deck selecionado
  const deckCardIds = (selectedDeck?.cards || []).map((dc) => dc.card.id);
  const availableCardsToAdd = cards.filter((c) => !deckCardIds.includes(c.id));

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
          ⚠️ <strong>Modo Visitante:</strong> Crie uma conta ou faça login para ter suas cartas e decks salvos com segurança.
        </div>
      )}

      {/* Menu Superior */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => {
              setSubTab("cards");
              setSelectedDeck(null);
            }}
            style={{
              background: subTab === "cards" ? "var(--gold-primary)" : "rgba(0,0,0,0.5)",
              color: subTab === "cards" ? "#000" : "#fff",
              border: "1px solid var(--gold-primary)",
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            🎴 Todas as Cartas ({cards.length})
          </button>
          <button
            onClick={() => setSubTab("decks")}
            style={{
              background: subTab === "decks" ? "var(--gold-primary)" : "rgba(0,0,0,0.5)",
              color: subTab === "decks" ? "#000" : "#fff",
              border: "1px solid var(--gold-primary)",
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            📦 Meus Decks ({decks.length})
          </button>
        </div>

        {subTab === "decks" && user && (
          <button
            onClick={handleOpenCreateModal}
            style={{
              background: "linear-gradient(135deg, #27ae60, #2ecc71)",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(46, 204, 113, 0.3)",
            }}
          >
            ➕ Criar Novo Deck
          </button>
        )}
      </div>

      {/* ABA 1: TODAS AS CARTAS */}
      {subTab === "cards" && (
        cards.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>
            Nenhuma carta encontrada na sua conta. Acesse o menu &quot;Criar Carta&quot; para começar!
          </p>
        ) : (
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {cards.map((card) => (
              <div key={card.id} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <CardRender card={card} onShowMore={onShowModal} />
                {user && (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => onEditCard(card)}
                      style={{
                        flex: 1,
                        background: "rgba(243, 156, 18, 0.15)",
                        border: "1px solid var(--gold-primary)",
                        color: "var(--gold-glow)",
                        padding: "6px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => setDeletingCard(card)}
                      style={{
                        flex: 1,
                        background: "rgba(231, 76, 60, 0.15)",
                        border: "1px solid var(--combat-red)",
                        color: "#ff8a80",
                        padding: "6px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {/* ABA 2: DECKS */}
      {subTab === "decks" && (
        selectedDeck ? (
          /* Visualização Interna do Deck Selecionado */
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <button
                onClick={() => setSelectedDeck(null)}
                style={{
                  background: "transparent",
                  color: "var(--gold-primary)",
                  border: "1px solid var(--gold-primary)",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                ← Voltar para Lista de Decks
              </button>

              <button
                onClick={() => handleOpenEditModal(selectedDeck)}
                style={{
                  background: "rgba(243, 156, 18, 0.2)",
                  border: "1px solid var(--gold-primary)",
                  color: "var(--gold-glow)",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                ✏️ Editar Informações do Deck
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              {selectedDeck.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedDeck.imageUrl}
                  alt=""
                  style={{ width: "32px", height: "32px", borderRadius: "6px", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: "24px" }}>📦</span>
              )}
              <h3 className="font-cinzel" style={{ color: "var(--gold-primary)", fontSize: "22px", margin: 0 }}>
                {selectedDeck.name}
              </h3>
            </div>

            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px" }}>
              {selectedDeck.description || "Sem descrição."}
            </p>

            <h4 style={{ color: "#fff", marginBottom: "12px" }}>Cartas no Deck ({selectedDeck.cards?.length || 0})</h4>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "32px" }}>
              {(selectedDeck.cards || []).map(({ card, quantity }) => (
                <div key={card.id} style={{ display: "flex", flexDirection: "column", gap: "8px", position: "relative" }}>
                  <CardRender card={card} onShowMore={onShowModal} />
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      background: "var(--gold-primary)",
                      color: "#000",
                      fontWeight: "bold",
                      borderRadius: "50%",
                      width: "28px",
                      height: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px #000",
                      zIndex: 10,
                    }}
                  >
                    x{quantity}
                  </div>
                  {user && (
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        onClick={() => onEditCard(card, selectedDeck.id)}
                        style={{
                          flex: 1,
                          background: "rgba(243, 156, 18, 0.2)",
                          border: "1px solid var(--gold-primary)",
                          color: "var(--gold-glow)",
                          padding: "6px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={async () => {
                          if (card.id && selectedDeck.id) {
                            await onRemoveCardFromDeck(selectedDeck.id, card.id);
                          }
                        }}
                        style={{
                          flex: 1,
                          background: "rgba(231, 76, 60, 0.2)",
                          border: "1px solid #e74c3c",
                          color: "#ff8a80",
                          padding: "6px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        Remover
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 📏 SEÇÃO DE SUGESTÃO COM AFASTAMENTO E FILTRO DE EXCLUSÃO */}
            <div
              style={{
                marginTop: "48px", // 👈 Distanciamento maior da seção de cartas do deck
                paddingTop: "24px",
                borderTop: "1px dashed rgba(212, 175, 55, 0.3)",
              }}
            >
              <h4 style={{ color: "var(--gold-primary)", marginBottom: "16px" }}>
                Adicionar Cartas da Coleção ao Deck
              </h4>

              {availableCardsToAdd.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                  Todas as cartas da sua coleção já foram adicionadas a este deck!
                </p>
              ) : (
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                  {availableCardsToAdd.map((card) => (
                    <div key={card.id} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <CardRender card={card} onShowMore={onShowModal} />
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          onClick={() => onEditCard(card, selectedDeck.id)}
                          style={{
                            background: "rgba(243, 156, 18, 0.2)",
                            border: "1px solid var(--gold-primary)",
                            color: "var(--gold-glow)",
                            padding: "8px",
                            borderRadius: "6px",
                            fontWeight: "bold",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                          title="Editar Carta"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={async () => {
                            if (card.id && selectedDeck.id) {
                              await onAddCardToDeck(selectedDeck.id, card.id, 1);
                            }
                          }}
                          style={{
                            flex: 1,
                            background: "linear-gradient(135deg, var(--gold-primary), #d4af37)",
                            color: "#000",
                            border: "none",
                            padding: "8px",
                            borderRadius: "6px",
                            fontWeight: "bold",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                        >
                          ➕ Adicionar ao Deck
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Lista de Decks */
          decks.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>
              Você ainda não criou nenhum deck. Clique em &quot;Criar Novo Deck&quot; acima para começar!
            </p>
          ) : (
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
                      onClick={() => setSelectedDeck(deck)}
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
                      onClick={() => handleOpenEditModal(deck)}
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
                      onClick={() => deck.id && setDeletingDeckId(deck.id)}
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
          )
        )
      )}

      {/* Glossário didático no final */}
      <GameGlossary />

      {/* Modal de Criar/Editar Deck */}
      {showDeckModal && (
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
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: "6px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(0,0,0,0.5)",
                color: "#fff",
                marginBottom: "12px",
              }}
            />

            <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
              URL do Ícone / Capa (PNG/JPG):
            </label>
            <input
              type="text"
              value={deckImageUrl}
              onChange={(e) => setDeckImageUrl(e.target.value)}
              placeholder="https://exemplo.com/escudo.png"
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: "6px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(0,0,0,0.5)",
                color: "#fff",
                marginBottom: "12px",
              }}
            />

            <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
              Descrição:
            </label>
            <textarea
              value={deckDesc}
              onChange={(e) => setDeckDesc(e.target.value)}
              placeholder="Escreva sobre a estratégia ou tema do deck..."
              style={{
                width: "100%",
                height: "60px",
                padding: "8px 10px",
                borderRadius: "6px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(0,0,0,0.5)",
                color: "#fff",
                marginBottom: "16px",
              }}
            />

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setShowDeckModal(false)}
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
                onClick={handleSaveDeckSubmit}
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
      )}

      {/* ConfirmModals para Cartas e Decks */}
      {deletingCard && (
        <ConfirmModal
          title="Excluir Carta?"
          message={`Tem certeza que deseja apagar a carta "${deletingCard.name}"?`}
          confirmText="Sim, Excluir"
          cancelText="Cancelar"
          onConfirm={() => {
            if (deletingCard.id) onDeleteCard(deletingCard.id);
            setDeletingCard(null);
          }}
          onCancel={() => setDeletingCard(null)}
        />
      )}

      {deletingDeckId && (
        <ConfirmModal
          title="Excluir Deck?"
          message="Tem certeza que deseja apagar este deck? As cartas continuarão salvas na sua coleção principal."
          confirmText="Sim, Excluir"
          cancelText="Cancelar"
          onConfirm={async () => {
            await onDeleteDeck(deletingDeckId);
            setDeletingDeckId(null);
          }}
          onCancel={() => setDeletingDeckId(null)}
        />
      )}
    </div>
  );
}