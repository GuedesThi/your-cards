/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { UserProfile } from "../types";
import { authService } from "../services/authService";
import { ConfirmModal } from "./ConfirmModal";
import { NotificationModal } from "./NotificationModal";
import "./ProfileSection.css";

interface ProfileSectionProps {
  user: UserProfile;
  onReloadUser: () => Promise<void>;
  onLogout: () => void;
}

export function ProfileSection({ user, onReloadUser, onLogout }: ProfileSectionProps) {
  const [username, setUsername] = useState(user.username || "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
  const [email, setEmail] = useState(user.email || "");
  const [newPassword, setNewPassword] = useState("");
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    title: string;
    message: string;
  } | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await authService.updateProfile(username, avatarUrl);
    if (error) {
      setNotification({ type: "error", title: "Erro", message: error.message });
    } else {
      await onReloadUser();
      setNotification({ type: "success", title: "Perfil Atualizado", message: "Suas informações foram salvas com sucesso!" });
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || email === user.email) return;
    const { error } = await authService.updateEmail(email);
    if (error) {
      setNotification({ type: "error", title: "Erro no E-mail", message: error.message });
    } else {
      setNotification({ type: "info", title: "Confirmação Enviada", message: "Enviamos um link de confirmação para o novo e-mail." });
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setNotification({ type: "error", title: "Senha Curta", message: "A nova senha deve possuir pelo menos 6 caracteres." });
      return;
    }
    const { error } = await authService.updatePassword(newPassword);
    if (error) {
      setNotification({ type: "error", title: "Erro na Senha", message: error.message });
    } else {
      setNewPassword("");
      setNotification({ type: "success", title: "Senha Alterada", message: "Sua senha foi redefinida com sucesso." });
    }
  };

  const handleDeleteAccount = async () => {
    const { error } = await authService.deleteAccount();
    if (error) {
      setNotification({ type: "error", title: "Falha na Remoção", message: error.message });
    } else {
      onLogout();
    }
  };

  return (
    <div className="prf-container">
      {/* Bloco 1: Informações Públicas (Nome de Usuário e Foto) */}
      <div className="prf-card">
        <div className="prf-header">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="Avatar" className="prf-avatar-preview" onError={(e: any) => e.target.style.display = 'none'} />
          ) : (
            <div className="prf-avatar-preview">👤</div>
          )}
          <div>
            <h2 className="font-cinzel prf-title">
              {user.username || "Guerreiro sem Nome"}
            </h2>
            <p className="prf-subtitle">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile}>
          <label className="prf-label">Nome de Usuário:</label>
          <input
            type="text"
            className="prf-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ex: MestreDosCards"
          />

          <label className="prf-label">URL da Foto de Perfil (PNG/JPG):</label>
          <input
            type="text"
            className="prf-input"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://exemplo.com/minha-foto.png"
          />

          <button type="submit" className="prf-save-btn">Salvar Perfil 💾</button>
        </form>
      </div>

      {/* Bloco 2: Segurança & Credenciais (E-mail e Senha) */}
      <div className="prf-card">
        <h3 className="font-cinzel prf-title">Segurança da Conta</h3>
        
        <form onSubmit={handleUpdateEmail}>
          <label className="prf-label">Alterar E-mail:</label>
          <input
            type="email"
            className="prf-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="prf-save-btn">Atualizar E-mail ✉️</button>
        </form>

        <form onSubmit={handleUpdatePassword} style={{ marginTop: "16px" }}>
          <label className="prf-label">Nova Senha:</label>
          <input
            type="password"
            className="prf-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
          />
          <button type="submit" className="prf-save-btn">Redefinir Senha 🔑</button>
        </form>
      </div>

      {/* Bloco 3: Zona de Perigo (Cancelar Conta) */}
      <div className="prf-card prf-card--danger">
        <h3 className="font-cinzel prf-danger-title">Zona de Perigo</h3>
        <p className="prf-subtitle">
          Ao cancelar sua conta, todos os seus dados, cartas e decks serão apagados permanentemente.
        </p>
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="prf-delete-btn"
        >
          Excluir Minha Conta 🗑️
        </button>
      </div>

      {showDeleteModal && (
        <ConfirmModal
          title="Excluir Conta Permanentemente?"
          message="Esta ação é irreversível. Todas as suas cartas forjadas e decks estruturados serão perdidos."
          confirmText="Sim, Cancelar Conta"
          cancelText="Voltar"
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {notification && (
        <NotificationModal
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}