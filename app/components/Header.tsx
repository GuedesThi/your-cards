import { ActiveTab } from "../types";

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  onLogout: () => void;
}

export function Header({ activeTab, setActiveTab, user, onLogout }: HeaderProps) {
  return (
    <header
      style={{
        background: "rgba(11, 13, 23, 0.95)",
        borderBottom: "1px solid var(--border-gold)",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(8px)",
      }}
    >
      <h1
        className="font-cinzel"
        style={{
          color: "var(--gold-primary)",
          cursor: "pointer",
          fontSize: "22px",
          letterSpacing: "1px",
        }}
        onClick={() => setActiveTab("landing")}
      >
        🃏 YOUR CARDS
      </h1>
      <nav style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <button style={navBtnStyle(activeTab === "landing")} onClick={() => setActiveTab("landing")}>
          Início
        </button>
        <button style={navBtnStyle(activeTab === "creator")} onClick={() => setActiveTab("creator")}>
          Criar Carta
        </button>
        <button style={navBtnStyle(activeTab === "library")} onClick={() => setActiveTab("library")}>
          Biblioteca
        </button>
        {user ? (
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: "12px",
                color: "var(--gold-glow)",
                maxWidth: "140px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={user.email}
            >
              👤 {user.email}
            </span>
            <button
              style={{ ...navBtnStyle(false), background: "#c70039", borderColor: "#c70039" }}
              onClick={onLogout}
            >
              Sair
            </button>
          </div>
        ) : (
          <button style={navBtnStyle(activeTab === "auth")} onClick={() => setActiveTab("auth")}>
            Entrar / Cadastrar
          </button>
        )}
      </nav>
    </header>
  );
}

const navBtnStyle = (active: boolean) => ({
  background: active ? "var(--gold-primary)" : "transparent",
  color: active ? "#000" : "var(--text-main)",
  border: "1px solid var(--border-gold)",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold" as const,
  fontSize: "12px",
  transition: "all 0.2s ease",
});