"use client";

import { useState } from "react";
import { ActiveTab, Card } from "./types";
import { useAuth } from "./hooks/useAuth";
import { useCards } from "./hooks/useCards";

import { Header } from "./components/Header";
import { LandingSection } from "./components/LandingSection";
import { CardCreatorSection } from "./components/CardCreatorSection";
import { CardLibrarySection } from "./components/CardLibrarySection";
import { AuthSection } from "./components/AuthSection";
import { DescriptionModal } from "./components/DescriptionModal";

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("landing");
  const [modalDescription, setModalDescription] = useState<string | null>(null);

  const { user, logout } = useAuth();
  const { cards, addCard } = useCards(user?.id);

  const handleSaveCard = async (newCard: Card) => {
    await addCard(newCard);
    setActiveTab("library");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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
            onSaveCard={handleSaveCard}
            onShowModal={setModalDescription}
            onRequireAuth={() => setActiveTab("auth")}
          />
        )}

        {activeTab === "library" && (
          <CardLibrarySection
            user={user}
            cards={cards}
            onShowModal={setModalDescription}
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