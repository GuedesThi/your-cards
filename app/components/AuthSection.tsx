import { useState } from "react";
import { AuthMode } from "../types";
import { authService } from "../services/authService";
import "./AuthSection.css";

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
    <div className="ath-card">
      {authMessage === "SUCCESS_REGISTER" ? (
        <div className="ath-card__center">
          <div className="ath-card__icon">📩</div>
          <h2 className="font-cinzel ath-card__title">Confirme seu E-mail</h2>
          <p className="ath-card__text">
            Enviamos um e-mail de confirmação para:
            <br />
            <strong style={{ color: "var(--gold-glow)" }}>{email}</strong>
          </p>
          <div className="ath-card__tip">
            💡 <strong>Dica:</strong> Clique no link do e-mail para ativar sua conta. Se não encontrar na caixa de entrada, verifique a pasta de <strong>Spam / Lixo Eletrônico</strong>.
          </div>
          <button
            onClick={() => {
              setAuthMode("login");
              setAuthMessage("");
            }}
            className="ath-card__submit-btn"
          >
            Ir para o Login
          </button>
        </div>
      ) : authMessage === "SUCCESS_FORGOT" ? (
        <div className="ath-card__center">
          <div className="ath-card__icon">🔑</div>
          <h2 className="font-cinzel ath-card__title">Instruções Enviadas</h2>
          <p className="ath-card__text">
            Se houver uma conta cadastrada para <strong style={{ color: "var(--gold-glow)" }}>{email}</strong>, enviamos as instruções para redefinição de senha.
          </p>
          <button
            onClick={() => {
              setAuthMode("login");
              setAuthMessage("");
            }}
            className="ath-card__submit-btn"
          >
            Voltar para o Login
          </button>
        </div>
      ) : (
        <>
          <h2 className="font-cinzel ath-card__title">
            {authMode === "login"
              ? "Entrar na Conta"
              : authMode === "register"
              ? "Criar Nova Conta"
              : "Recuperar Senha"}
          </h2>
          {authMessage && <p className="ath-card__msg">{authMessage}</p>}
          <form onSubmit={handleAuth}>
            <label className="ath-card__label">Email:</label>
            <input
              type="email"
              className="ath-card__input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />

            {authMode !== "forgot" && (
              <>
                <div className="ath-card__pass-header">
                  <label className="ath-card__label" style={{ marginTop: 0, marginBottom: 0 }}>
                    Senha:
                  </label>
                  {authMode === "login" && (
                    <span
                      className="ath-card__forgot"
                      onClick={() => {
                        setAuthMode("forgot");
                        setAuthMessage("");
                      }}
                    >
                      Esqueceu a senha?
                    </span>
                  )}
                </div>

                <div className="ath-card__pass-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="ath-card__input ath-card__input--has-button"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ath-card__toggle-btn"
                    title={showPassword ? "Ocultar senha" : "Exibir senha"}
                  >
                    {showPassword ? "👁️" : "🙈"}
                  </button>
                </div>
              </>
            )}

            <button type="submit" className="ath-card__submit-btn">
              {authMode === "login"
                ? "Acessar Conta"
                : authMode === "register"
                ? "Cadastrar"
                : "Enviar E-mail de Recuperação"}
            </button>
          </form>

          <div className="ath-card__footer">
            {authMode === "forgot" ? (
              <p
                className="ath-card__link"
                onClick={() => {
                  setAuthMode("login");
                  setAuthMessage("");
                }}
              >
                Lembrou da senha? Voltar ao login
              </p>
            ) : (
              <p
                className="ath-card__link"
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