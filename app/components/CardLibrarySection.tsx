/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Card, Deck } from "../types";
import { CardsGrid } from "./library/CardsGrid";
import { DecksGrid } from "./library/DecksGrid";
import { DeckDetailView } from "./library/DeckDetailView";
import { DeckFormModal } from "./library/DeckFormModal";
import { ConfirmModal } from "./ConfirmModal";
import { GameGlossary } from "./GameGlossary";

interface CardLibrarySectionProps {
  user: any;
  cards: Card[];
  decks: Deck[];
  initialDeckId?: string | null;
  onShowModal: (desc: string) => void;
  onEditCard: (card: Card, deckId?: string) => void;
  onDeleteCard: (card: Card) => Promise<void>;
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

  // Sincroniza o deck inicial (ex: vindo da edição)
  useEffect(() => {
    if (initialDeckId && decks.length > 0) {
      const targetDeck = decks.find((d) => d.id === initialDeckId);
      if (targetDeck) {
        setSelectedDeck(targetDeck);
        setSubTab("decks");
      }
    }
  }, [initialDeckId, decks]);

  // Atualiza a visualização do deck selecionado quando seus dados mudam
  useEffect(() => {
    if (selectedDeck) {
      const updatedDeck = decks.find((d) => d.id === selectedDeck.id);
      if (updatedDeck) setSelectedDeck(updatedDeck);
    }
  }, [decks]);

  const [deletingCard, setDeletingCard] = useState<Card | null>(null);
  const [deletingDeckId, setDeletingDeckId] = useState<string | null>(null);

  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const [showDeckModal, setShowDeckModal] = useState(false);

  const handleOpenCreateModal = () => {
    setEditingDeck(null);
    setShowDeckModal(true);
  };

  const handleOpenEditModal = (deck: Deck) => {
    setEditingDeck(deck);
    setShowDeckModal(true);
  };

  const handleSaveDeckSubmit = async (name: string, description: string, imageUrl?: string) => {
    if (editingDeck?.id) {
      await onUpdateDeck(editingDeck.id, name, description, imageUrl);
    } else {
      await onCreateDeck(name, description, imageUrl);
    }
  };

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

      {/* Menu de Abas */}
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

      {/* Exibição Conforme a Seleção */}
      {subTab === "cards" && (
        <CardsGrid
          user={user}
          cards={cards}
          onShowModal={onShowModal}
          onEditCard={onEditCard}
          onDeleteCard={(card) => setDeletingCard(card)}
        />
      )}

      {subTab === "decks" && (
        selectedDeck ? (
          <DeckDetailView
            user={user}
            deck={selectedDeck}
            allCards={cards}
            onBack={() => setSelectedDeck(null)}
            onEditDeck={handleOpenEditModal}
            onEditCard={onEditCard}
            onRemoveCardFromDeck={onRemoveCardFromDeck}
            onAddCardToDeck={onAddCardToDeck}
            onShowModal={onShowModal}
          />
        ) : (
          <DecksGrid
            decks={decks}
            onSelectDeck={setSelectedDeck}
            onEditDeck={handleOpenEditModal}
            onDeleteDeck={(id) => setDeletingDeckId(id)}
          />
        )
      )}

      {/* Glossário didático no final */}
      <GameGlossary />

      {/* Modal de Criar/Editar Deck */}
      {showDeckModal && (
        <DeckFormModal
          editingDeck={editingDeck}
          onClose={() => setShowDeckModal(false)}
          onSubmit={handleSaveDeckSubmit}
        />
      )}

      {/* Modais de Confirmação */}
      {deletingCard && (
        <ConfirmModal
          title="Excluir Carta?"
          message={`Tem certeza que deseja apagar a carta "${deletingCard.name}"?`}
          confirmText="Sim, Excluir"
          cancelText="Cancelar"
          onConfirm={() => {
            onDeleteCard(deletingCard);
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