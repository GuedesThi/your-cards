import { useState } from "react";
import { AuthMode } from "../types";
import { authService } from "../services/authService";

interface AuthSectionProps {
  onSuccessLogin: () => void;
}

export function AuthSection({ onSuccessLogin }: AuthSectionProps) {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authMessage, setAuthMessage] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage("Processando...");

    if (authMode === "forgot") {
      const { error } = await authService.resetPassword(email);
      if (error) {
        setAuthMessage("Erro ao solicitar redefinição. Verifique o e-mail digitado.");
      } else {
        setAuthMessage("SUCCESS_FORGOT");
      }
      return;
    }

    if (authMode === "register") {
      const { data, error } = await authService.signUp(email, password);
      if (error) {
        if (error.message.includes("User already registered")) {
          setAuthMessage("Este e-mail já está cadastrado. Tente fazer login.");
        } else if (error.message.includes("Password should be at least")) {
          setAuthMessage("A senha deve ter pelo menos 6 caracteres.");
        } else {
          setAuthMessage(error.message);
        }
      } else if (data?.user && data?.session === null) {
        setAuthMessage("SUCCESS_REGISTER");
      } else {
        setAuthMessage("Conta criada e autenticada com sucesso!");
        onSuccessLogin();
      }
    } else {
      const { error } = await authService.signIn(email, password);
      if (error) {
        if (
          error.message.includes("Invalid login credentials") ||
          error.message.includes("invalid_credentials")
        ) {
          setAuthMessage("E-mail ou senha incorretos. Verifique seus dados e tente novamente.");
        } else if (error.message.includes("Email not confirmed")) {
          setAuthMessage("Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada.");
        } else {
          setAuthMessage("Ocorreu um erro ao acessar a conta. Tente novamente em instantes.");
        }
      } else {
        setAuthMessage("");
        onSuccessLogin();
      }
    }
  };

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "40px auto",
        background: "var(--panel-bg)",
        padding: "32px",
        borderRadius: "12px",
        border: "1px solid var(--border-gold)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
      }}
    >
      {authMessage === "SUCCESS_REGISTER" ? (
        <div style={{ textAlign: "center", padding: "12px 0" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📩</div>
          <h2
            className="font-cinzel"
            style={{
              color: "var(--gold-primary)",
              fontSize: "22px",
              marginBottom: "12px",
            }}
          >
            Confirme seu E-mail
          </h2>
          <p
            style={{
              color: "#fff",
              fontSize: "14px",
              lineHeight: "1.6",
              marginBottom: "16px",
            }}
          >
            Enviamos um e-mail de confirmação para:
            <br />
            <strong style={{ color: "var(--gold-glow)" }}>{email}</strong>
          </p>
          <div
            style={{
              background: "rgba(243, 156, 18, 0.1)",
              border: "1px dashed var(--gold-primary)",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "12px",
              color: "var(--text-muted)",
              marginBottom: "24px",
              textAlign: "left",
            }}
          >
            💡 <strong>Dica:</strong> Clique no link do e-mail para ativar sua
            conta. Se não encontrar na caixa de entrada, verifique a pasta de{" "}
            <strong>Spam / Lixo Eletrônico</strong>.
          </div>
          <button
            onClick={() => {
              setAuthMode("login");
              setAuthMessage("");
            }}
            style={primaryBtnStyle}
          >
            Ir para o Login
          </button>
        </div>
      ) : authMessage === "SUCCESS_FORGOT" ? (
        <div style={{ textAlign: "center", padding: "12px 0" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔑</div>
          <h2
            className="font-cinzel"
            style={{
              color: "var(--gold-primary)",
              fontSize: "22px",
              marginBottom: "12px",
            }}
          >
            Instruções Enviadas
          </h2>
          <p
            style={{
              color: "#fff",
              fontSize: "14px",
              lineHeight: "1.6",
              marginBottom: "16px",
            }}
          >
            Se houver uma conta cadastrada para{" "}
            <strong style={{ color: "var(--gold-glow)" }}>{email}</strong>,
            enviamos as instruções para redefinição de senha.
          </p>
          <button
            onClick={() => {
              setAuthMode("login");
              setAuthMessage("");
            }}
            style={primaryBtnStyle}
          >
            Voltar para o Login
          </button>
        </div>
      ) : (
        <>
          <h2
            className="font-cinzel"
            style={{
              color: "var(--gold-primary)",
              marginBottom: "16px",
              textAlign: "center",
              fontSize: "22px",
            }}
          >
            {authMode === "login"
              ? "Entrar na Conta"
              : authMode === "register"
              ? "Criar Nova Conta"
              : "Recuperar Senha"}
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

            {authMode !== "forgot" && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "10px",
                    marginBottom: "4px",
                  }}
                >
                  <label
                    style={{ ...labelStyle, marginTop: 0, marginBottom: 0 }}
                  >
                    Senha:
                  </label>
                  {authMode === "login" && (
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--gold-glow)",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => {
                        setAuthMode("forgot");
                        setAuthMessage("");
                      }}
                    >
                      Esqueceu a senha?
                    </span>
                  )}
                </div>

                <div style={{ position: "relative", width: "100%" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    style={{ ...inputStyle, paddingRight: "40px" }}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "16px",
                      color: "var(--text-muted)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px",
                    }}
                    title={showPassword ? "Ocultar senha" : "Exibir senha"}
                  >
                    {showPassword ? "👁️" : "🙈"}
                  </button>
                </div>
              </>
            )}

            <button
              type="submit"
              style={{ ...primaryBtnStyle, marginTop: "20px" }}
            >
              {authMode === "login"
                ? "Acessar Conta"
                : authMode === "register"
                ? "Cadastrar"
                : "Enviar E-mail de Recuperação"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            {authMode === "forgot" ? (
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => {
                  setAuthMode("login");
                  setAuthMessage("");
                }}
              >
                Lembrou da senha? Voltar ao login
              </p>
            ) : (
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => {
                  setAuthMode(authMode === "login" ? "register" : "login");
                  setAuthMessage("");
                }}
              >
                {authMode === "login"
                  ? "Ainda não tem conta? Cadastre-se"
                  : "Já possui uma conta? Faça login"}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

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

const primaryBtnStyle = {
  background: "linear-gradient(135deg, var(--gold-primary), #d4af37)",
  color: "#000",
  border: "none",
  padding: "12px 24px",
  borderRadius: "8px",
  fontWeight: "bold" as const,
  fontSize: "15px",
  cursor: "pointer",
  width: "100%",
};