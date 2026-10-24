import "./ConfirmModal.css";

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  title,
  message,
  confirmText = "Excluir",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="cfm-modal-overlay">
      <div className="cfm-modal-content">
        <div className="cfm-modal__icon">🗑️</div>
        <h3 className="font-cinzel cfm-modal__title">{title}</h3>
        <p className="cfm-modal__text">{message}</p>
        <div className="cfm-modal__actions">
          <button onClick={onCancel} className="cfm-modal__btn-cancel">
            {cancelText}
          </button>
          <button onClick={onConfirm} className="cfm-modal__btn-confirm">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}