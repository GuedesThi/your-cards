import { ActiveTab, UserProfile } from "../types";
import "./Header.css";

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: UserProfile | null;
  onLogout: () => void;
}

export function Header({ activeTab, setActiveTab, user, onLogout }: HeaderProps) {
  const displayName = user?.username || user?.email || "Minha Conta";

  return (
    <header className="hdr-container">
      <h1
        className="font-cinzel hdr-container__title"
        onClick={() => setActiveTab("landing")}
      >
        🃏 YOUR CARDS
      </h1>
      <nav className="hdr-container__nav">
        <button
          className={`hdr-container__btn ${activeTab === "landing" ? "hdr-container__btn--active" : ""}`}
          onClick={() => setActiveTab("landing")}
        >
          Início
        </button>
        <button
          className={`hdr-container__btn ${activeTab === "creator" ? "hdr-container__btn--active" : ""}`}
          onClick={() => setActiveTab("creator")}
        >
          Criar Carta
        </button>
        <button
          className={`hdr-container__btn ${activeTab === "library" ? "hdr-container__btn--active" : ""}`}
          onClick={() => setActiveTab("library")}
        >
          Biblioteca
        </button>
        {user ? (
          <div className="hdr-container__user">
            <button
              className={`hdr-container__btn ${activeTab === "profile" ? "hdr-container__btn--active" : ""}`}
              onClick={() => setActiveTab("profile")}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt=""
                  style={{ width: "18px", height: "18px", borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                <span>👤</span>
              )}
              <span className="hdr-container__email" title={displayName}>
                {displayName}
              </span>
            </button>
            <button
              className="hdr-container__btn hdr-container__btn--logout"
              onClick={onLogout}
            >
              Sair
            </button>
          </div>
        ) : (
          <button
            className={`hdr-container__btn ${activeTab === "auth" ? "hdr-container__btn--active" : ""}`}
            onClick={() => setActiveTab("auth")}
          >
            Entrar / Cadastrar
          </button>
        )}
      </nav>
    </header>
  );
}