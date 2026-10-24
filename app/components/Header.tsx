import { ActiveTab } from "../types";
import "./Header.css";

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  onLogout: () => void;
}

export function Header({ activeTab, setActiveTab, user, onLogout }: HeaderProps) {
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
            <span className="hdr-container__email" title={user.email}>
              👤 {user.email}
            </span>
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