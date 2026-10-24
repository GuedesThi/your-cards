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
import { ProfileSection } from "./components/ProfileSection";
import { DescriptionModal } from "./components/DescriptionModal";

import "./page.css";

export default function Home() {
  const [activeTab, setActiveTabState] = useState<ActiveTab>("landing");
  const [mounted, setMounted] = useState(false);

  const [modalDescription, setModalDescription] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);

  // Sincroniza a aba salva no localStorage APÓS a montagem no cliente para evitar erro de hidratação
  useEffect(() => {
    setMounted(true);
    const savedTab = localStorage.getItem("activeTab") as ActiveTab | null;
    if (savedTab) {
      setActiveTabState(savedTab);
    }
  }, []);

  const setActiveTab = (tab: ActiveTab) => {
    setActiveTabState(tab);
    localStorage.setItem("activeTab", tab);
  };

  const { user, logout, reloadUser } = useAuth();
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
    await reloadDecks();
    setEditingCard(null);
    setActiveTab("library");
  };

  const handleStartEdit = (card: Card, deckId?: string) => {
    setEditingCard(card);
    if (deckId) {
      setActiveDeckId(deckId);
    } else {
      setActiveDeckId(null);
    }
    setActiveTab("creator");
  };

  // Evita inconsistência de renderização até o componente ser montado no navegador
  if (!mounted) {
    return null;
  }

  return (
    <div className="pg-container">
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

      <main className="pg-main">
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

        {activeTab === "profile" && user && (
          <ProfileSection
            user={user}
            onReloadUser={reloadUser}
            onLogout={logout}
          />
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