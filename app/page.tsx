/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { ActiveTab, Card } from "./types";
import { useAuth } from "./hooks/useAuth";
import { useCards } from "./hooks/useCards";
import { useDecks } from "./hooks/useDecks";

import { Header } from "./components/Header";
import { LandingSection } from "./components/LandingSection";
import { CardCreatorSection } from "./components/CardCreatorSection";
import { CardLibrarySection } from "./components/CardLibrarySection";
import { AuthSection } from "./components/AuthSection";
import { DescriptionModal } from "./components/DescriptionModal";

export default function Home() {
  const [activeTab, setActiveTabState] = useState<ActiveTab>("landing");
  const [modalDescription, setModalDescription] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  
  // Guardamos o contexto de onde a edição iniciou
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);

  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab") as ActiveTab | null;
    if (savedTab) {
      setActiveTabState(savedTab);
    }
  }, []);

  const setActiveTab = (tab: ActiveTab) => {
    setActiveTabState(tab);
    localStorage.setItem("activeTab", tab);
  };

  const { user, logout } = useAuth();
  const { cards, saveOrUpdateCard, removeCard } = useCards(user?.id);
  const {
    decks,
    createDeck,
    updateDeck,
    addCardToDeck,
    removeCardFromDeck,
    deleteDeck,
    reloadDecks,
  } = useDecks(user?.id);

  const handleSaveCard = async (newCard: Card) => {
    await saveOrUpdateCard(newCard);
    await reloadDecks(); // Atualiza os dados das cartas nos decks
    setEditingCard(null);
    
    // Retorna para a biblioteca
    setActiveTab("library");
  };

  // Inicia a edição vinda da Biblioteca Geral ou de um Deck específico
  const handleStartEdit = (card: Card, deckId?: string) => {
    setEditingCard(card);
    if (deckId) {
      setActiveDeckId(deckId);
    } else {
      setActiveDeckId(null);
    }
    setActiveTab("creator");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== "creator") {
            setEditingCard(null);
            setActiveDeckId(null);
          }
          setActiveTab(tab);
        }}
        user={user}
        onLogout={logout}
      />

      <main
        style={{
          flex: 1,
          padding: "32px 16px",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {activeTab === "landing" && (
          <LandingSection onStartClick={() => setActiveTab("creator")} />
        )}

        {activeTab === "creator" && (
          <CardCreatorSection
            user={user}
            editingCard={editingCard}
            onSaveCard={handleSaveCard}
            onShowModal={setModalDescription}
            onRequireAuth={() => setActiveTab("auth")}
            onCancelEdit={() => setEditingCard(null)}
          />
        )}

        {activeTab === "library" && (
          <CardLibrarySection
            user={user}
            cards={cards}
            decks={decks}
            initialDeckId={activeDeckId}
            onShowModal={setModalDescription}
            onEditCard={handleStartEdit}
            onDeleteCard={removeCard}
            onCreateDeck={createDeck}
            onUpdateDeck={updateDeck}
            onAddCardToDeck={addCardToDeck}
            onRemoveCardFromDeck={removeCardFromDeck}
            onDeleteDeck={deleteDeck}
          />
        )}

        {activeTab === "auth" && (
          <AuthSection onSuccessLogin={() => setActiveTab("library")} />
        )}
      </main>

      {modalDescription && (
        <DescriptionModal
          description={modalDescription}
          onClose={() => setModalDescription(null)}
        />
      )}
    </div>
  );
}