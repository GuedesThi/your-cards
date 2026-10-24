import "./NotificationModal.css";

interface NotificationModalProps {
  type: "success" | "error" | "info";
  title: string;
  message: string;
  onClose: () => void;
}

export function NotificationModal({
  type,
  title,
  message,
  onClose,
}: NotificationModalProps) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return "✨";
      case "error":
        return "⚠️";
      default:
        return "💡";
    }
  };

  return (
    <div className="ntf-modal-overlay">
      <div className={`ntf-modal-content ntf-modal-content--${type}`}>
        <div className="ntf-modal__icon">{getIcon()}</div>
        <h3 className={`font-cinzel ntf-modal__title ntf-modal__title--${type}`}>
          {title}
        </h3>
        <p className="ntf-modal__message">{message}</p>
        <button
          onClick={onClose}
          className={`ntf-modal__btn ntf-modal__btn--${type}`}
        >
          Entendido
        </button>
      </div>
    </div>
  );
}