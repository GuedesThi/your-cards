"use client";

import { useState, useEffect, useCallback } from "react";
// Importação correta para Client Components no navegador
import { createClient } from "./utils/supabase/client";

export default function Home() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState("landing");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cards, setCards] = useState<any[]>([]);
  const [modalDescription, setModalDescription] = useState<string | null>(null);

  // Form de criação
  const [cardForm, setCardForm] = useState({
    name: "",
    type: "combat",
    attack: 5,
    defense: 5,
    description: "",
    imageUrl: "",
    scale: 1.0,
    posX: 0,
    posY: 0,
  });

  // Form de Auth
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  // Buscar Cartas do Banco
  const loadCards = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) setCards(data);
  }, [supabase]);

  // Sincronizar Sessão
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        loadCards(session.user.id);
      }
    };
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        loadCards(session.user.id);
      } else {
        setUser(null);
        setCards([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, loadCards]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage("Processando...");

    if (authMode === "register") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setAuthMessage(error.message);
      else
        setAuthMessage("Conta criada com sucesso! Você já pode fazer login.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setAuthMessage(error.message);
      else {
        setAuthMessage("");
        setActiveTab("library");
      }
    }
  };

  const handleSaveCard = async () => {
    if (!user) {
      alert(
        "Você precisa estar logado para salvar suas cartas no banco de dados!"
      );
      setActiveTab("auth");
      return;
    }

    const { data, error } = await supabase
      .from("cards")
      .insert([
        {
          user_id: user.id,
          name: cardForm.name || "Nova Carta",
          type: cardForm.type,
          attack: cardForm.attack,
          defense: cardForm.defense,
          description: cardForm.description,
          image_url: cardForm.imageUrl,
          scale: cardForm.scale,
          pos_x: cardForm.posX,
          pos_y: cardForm.posY,
        },
      ])
      .select();

    if (error) {
      alert("Erro ao salvar carta: " + error.message);
    } else {
      alert("Carta salva no banco com sucesso!");
      if (data) setCards([data[0], ...cards]);
      setActiveTab("library");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setActiveTab("landing");
  };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* Header / Nav */}
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
        <nav style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            style={navBtnStyle(activeTab === "landing")}
            onClick={() => setActiveTab("landing")}
          >
            Início
          </button>
          <button
            style={navBtnStyle(activeTab === "creator")}
            onClick={() => setActiveTab("creator")}
          >
            Criar Carta
          </button>
          <button
            style={navBtnStyle(activeTab === "library")}
            onClick={() => setActiveTab("library")}
          >
            Biblioteca
          </button>
          {user ? (
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "var(--gold-glow)" }}>
                👤 {user.email}
              </span>
              <button
                style={{
                  ...navBtnStyle(false),
                  background: "#c70039",
                  borderColor: "#c70039",
                }}
                onClick={handleLogout}
              >
                Sair
              </button>
            </div>
          ) : (
            <button
              style={navBtnStyle(activeTab === "auth")}
              onClick={() => setActiveTab("auth")}
            >
              Entrar / Cadastrar
            </button>
          )}
        </nav>
      </header>

      {/* Conteúdo Principal */}
      <main
        style={{
          flex: 1,
          padding: "32px 16px",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* LANDING */}
        {activeTab === "landing" && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <h2
              className="font-cinzel"
              style={{
                fontSize: "42px",
                color: "var(--gold-glow)",
                marginBottom: "16px",
                textShadow: "0 0 20px rgba(243, 156, 18, 0.3)",
              }}
            >
              Forje Suas Próprias Cartas de Duelo
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                maxWidth: "640px",
                margin: "0 auto 36px auto",
                lineHeight: "1.7",
                fontSize: "16px",
              }}
            >
              Crie criaturas, feitiços e estratégias customizadas com imagens,
              ajustes de enquadramento, atributos e salvamento seguro em banco
              de dados.
            </p>
            <button
              onClick={() => setActiveTab("creator")}
              style={primaryBtnStyle}
            >
              Começar a Criar Agora 🚀
            </button>
          </div>
        )}

        {/* CRIADOR */}
        {activeTab === "creator" && (
          <div
            style={{
              display: "flex",
              gap: "32px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {/* Form */}
            <div
              style={{
                flex: "1 1 380px",
                background: "var(--panel-bg)",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}
            >
              <h3
                className="font-cinzel"
                style={{
                  color: "var(--gold-primary)",
                  marginBottom: "16px",
                  fontSize: "18px",
                }}
              >
                Personalizar Carta
              </h3>

              <label style={labelStyle}>Nome da Carta:</label>
              <input
                type="text"
                style={inputStyle}
                value={cardForm.name}
                onChange={(e) =>
                  setCardForm({ ...cardForm, name: e.target.value })
                }
                placeholder="Ex: Dragão Obscuro"
              />

              <label style={labelStyle}>Tipo:</label>
              <select
                style={inputStyle}
                value={cardForm.type}
                onChange={(e) =>
                  setCardForm({ ...cardForm, type: e.target.value })
                }
              >
                <option value="combat">Combate</option>
                <option value="effect">Efeito</option>
              </select>

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

              <label style={labelStyle}>URL da Imagem:</label>
              <input
                type="text"
                style={inputStyle}
                placeholder="https://exemplo.com/imagem.png"
                value={cardForm.imageUrl}
                onChange={(e) =>
                  setCardForm({ ...cardForm, imageUrl: e.target.value })
                }
              />

              {/* Sliders de Enquadramento */}
              <div
                style={{
                  background: "rgba(0,0,0,0.4)",
                  padding: "14px",
                  borderRadius: "8px",
                  margin: "14px 0",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <label style={labelStyle}>
                  Zoom / Escala: ({cardForm.scale}x)
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={cardForm.scale}
                  onChange={(e) =>
                    setCardForm({
                      ...cardForm,
                      scale: parseFloat(e.target.value),
                    })
                  }
                  style={{ width: "100%", accentColor: "var(--gold-primary)" }}
                />

                <label style={labelStyle}>
                  Posição Horizontal (X): ({cardForm.posX}px)
                </label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={cardForm.posX}
                  onChange={(e) =>
                    setCardForm({ ...cardForm, posX: parseInt(e.target.value) })
                  }
                  style={{ width: "100%", accentColor: "var(--gold-primary)" }}
                />

                <label style={labelStyle}>
                  Posição Vertical (Y): ({cardForm.posY}px)
                </label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={cardForm.posY}
                  onChange={(e) =>
                    setCardForm({ ...cardForm, posY: parseInt(e.target.value) })
                  }
                  style={{ width: "100%", accentColor: "var(--gold-primary)" }}
                />
              </div>

              <label style={labelStyle}>Descrição da Habilidade:</label>
              <textarea
                style={{ ...inputStyle, height: "80px", resize: "vertical" }}
                value={cardForm.description}
                onChange={(e) =>
                  setCardForm({ ...cardForm, description: e.target.value })
                }
                placeholder="Escreva os efeitos ou a história da sua carta..."
              />

              <button
                onClick={handleSaveCard}
                style={{ ...primaryBtnStyle, width: "100%", marginTop: "16px" }}
              >
                Salvar na Biblioteca 💾
              </button>
            </div>

            {/* Preview */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h3
                className="font-cinzel"
                style={{ color: "var(--text-muted)", marginBottom: "16px" }}
              >
                Pré-visualização em Tempo Real
              </h3>
              <CardRender card={cardForm} onShowMore={setModalDescription} />
            </div>
          </div>
        )}

        {/* BIBLIOTECA */}
        {activeTab === "library" && (
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
                ⚠️ <strong>Modo Visitante:</strong> Crie uma conta ou faça login
                para ter suas cartas salvas no banco de dados com segurança.
              </div>
            )}
            <h2
              className="font-cinzel"
              style={{
                color: "var(--gold-primary)",
                marginBottom: "24px",
                fontSize: "26px",
              }}
            >
              Sua Coleção de Cartas
            </h2>
            {cards.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>
                Nenhuma carta encontrada na sua conta. Acesse o menu &quot;Criar
                Carta&quot; para começar!
              </p>
            ) : (
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                {cards.map((card) => (
                  <CardRender
                    key={card.id}
                    card={{
                      ...card,
                      imageUrl: card.image_url,
                      posX: card.pos_x,
                      posY: card.pos_y,
                    }}
                    onShowMore={setModalDescription}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* AUTENTICAÇÃO */}
        {activeTab === "auth" && (
          <div
            style={{
              maxWidth: "400px",
              margin: "40px auto",
              background: "var(--panel-bg)",
              padding: "32px",
              borderRadius: "12px",
              border: "1px solid var(--border-gold)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            }}
          >
            <h2
              className="font-cinzel"
              style={{
                color: "var(--gold-primary)",
                marginBottom: "16px",
                textAlign: "center",
                fontSize: "22px",
              }}
            >
              {authMode === "login" ? "Entrar na Conta" : "Criar Nova Conta"}
            </h2>
            {authMessage && (
              <p
                style={{
                  color: "var(--gold-glow)",
                  fontSize: "13px",
                  marginBottom: "16px",
                  textAlign: "center",
                  background: "rgba(0,0,0,0.3)",
                  padding: "8px",
                  borderRadius: "6px",
                }}
              >
                {authMessage}
              </p>
            )}
            <form onSubmit={handleAuth}>
              <label style={labelStyle}>Email:</label>
              <input
                type="email"
                style={inputStyle}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />

              <label style={labelStyle}>Senha:</label>
              <input
                type="password"
                style={inputStyle}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />

              <button
                type="submit"
                style={{ ...primaryBtnStyle, width: "100%", marginTop: "20px" }}
              >
                {authMode === "login" ? "Acessar Conta" : "Cadastrar"}
              </button>
            </form>
            <p
              style={{
                textAlign: "center",
                marginTop: "20px",
                fontSize: "13px",
                color: "var(--text-muted)",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() =>
                setAuthMode(authMode === "login" ? "register" : "login")
              }
            >
              {authMode === "login"
                ? "Ainda não tem conta? Cadastre-se"
                : "Já possui uma conta? Faça login"}
            </p>
          </div>
        )}
      </main>

      {/* Modal de Descrição Completa */}
      {modalDescription && (
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
              background: "var(--bg-color)",
              border: "1px solid var(--border-gold)",
              padding: "28px",
              borderRadius: "12px",
              maxWidth: "440px",
              width: "90%",
              boxShadow: "0 12px 40px rgba(0,0,0,0.8)",
            }}
          >
            <h3
              className="font-cinzel"
              style={{
                color: "var(--gold-primary)",
                marginBottom: "14px",
                fontSize: "18px",
              }}
            >
              Descrição Completa
            </h3>
            <p
              style={{
                color: "#fff",
                fontSize: "14px",
                lineHeight: "1.6",
                marginBottom: "24px",
                whiteSpace: "pre-wrap",
              }}
            >
              {modalDescription}
            </p>
            <button
              onClick={() => setModalDescription(null)}
              style={{ ...primaryBtnStyle, width: "100%" }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Renderizador da Carta
function CardRender({
  card,
  onShowMore,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  card: any;
  onShowMore: (desc: string) => void;
}) {
  const isCombat = card.type === "combat";
  const isLong = (card.description || "").length > 85;

  return (
    <div
      style={{
        width: "280px",
        height: "420px",
        borderRadius: "16px",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        background: isCombat
          ? "linear-gradient(135deg, #2c1212 0%, #1a0808 100%)"
          : "linear-gradient(135deg, #0e1e2d 0%, #060e17 100%)",
        border: `3px solid ${isCombat ? "#e74c3c" : "#2980b9"}`,
        boxShadow: `0 8px 24px ${isCombat ? "rgba(231, 76, 60, 0.35)" : "rgba(41, 128, 185, 0.35)"}`,
        color: "#fff",
        userSelect: "none",
      }}
    >
      {/* Header da Carta */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(0,0,0,0.6)",
          padding: "6px 12px",
          borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <span
          className="font-cinzel"
          style={{
            fontWeight: "bold",
            fontSize: "14px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "160px",
          }}
        >
          {card.name || "Nova Carta"}
        </span>
        <span
          style={{
            fontSize: "10px",
            padding: "2px 8px",
            borderRadius: "10px",
            fontWeight: "bold",
            textTransform: "uppercase",
            background: isCombat ? "#e74c3c" : "#2980b9",
          }}
        >
          {isCombat ? "Combate" : "Efeito"}
        </span>
      </div>

      {/* Frame de Imagem */}
      <div
        style={{
          width: "100%",
          height: "180px",
          borderRadius: "8px",
          overflow: "hidden",
          position: "relative",
          border: "2px solid rgba(212, 175, 55, 0.5)",
          backgroundColor: "#000",
        }}
      >
        {card.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={card.imageUrl}
            alt={card.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${card.scale || 1}) translate(${card.posX || 0}px, ${card.posY || 0}px)`,
              transition: "transform 0.1s ease-out",
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError={(e: any) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#666",
              fontSize: "12px",
            }}
          >
            Sem Imagem
          </div>
        )}
      </div>

      {/* Descrição */}
      <div
        style={{
          background: "rgba(0, 0, 0, 0.7)",
          padding: "8px 10px",
          borderRadius: "8px",
          height: "80px",
          fontSize: "11px",
          lineHeight: "1.3",
          overflow: "hidden",
          position: "relative",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <p
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {card.description || "Sem descrição."}
        </p>
        {isLong && (
          <button
            onClick={() => onShowMore(card.description)}
            style={{
              position: "absolute",
              bottom: "2px",
              right: "6px",
              background: "var(--gold-primary)",
              color: "#000",
              border: "none",
              borderRadius: "4px",
              fontSize: "9px",
              fontWeight: "bold",
              padding: "2px 6px",
              cursor: "pointer",
            }}
          >
            Mostrar tudo
          </button>
        )}
      </div>

      {/* Atributos */}
      <div style={{ display: "flex", gap: "8px" }}>
        <div
          style={{
            flex: 1,
            background: "linear-gradient(to right, #900c3f, #c70039)",
            padding: "6px",
            borderRadius: "6px",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "12px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
          }}
        >
          ⚔️ ATK: {card.attack || 0}
        </div>
        <div
          style={{
            flex: 1,
            background: "linear-gradient(to right, #1f4068, #162447)",
            padding: "6px",
            borderRadius: "6px",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "12px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
          }}
        >
          🛡️ DEF: {card.defense || 0}
        </div>
      </div>
    </div>
  );
}

const navBtnStyle = (active: boolean) => ({
  background: active ? "var(--gold-primary)" : "transparent",
  color: active ? "#000" : "var(--text-main)",
  border: "1px solid var(--border-gold)",
  padding: "6px 14px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold" as const,
  fontSize: "13px",
  transition: "all 0.2s ease",
});

const primaryBtnStyle = {
  background: "linear-gradient(135deg, var(--gold-primary), #d4af37)",
  color: "#000",
  border: "none",
  padding: "12px 24px",
  borderRadius: "8px",
  fontWeight: "bold" as const,
  fontSize: "15px",
  cursor: "pointer",
  boxShadow: "0 4px 14px rgba(243, 156, 18, 0.3)",
};

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