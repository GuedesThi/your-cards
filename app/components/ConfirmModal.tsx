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
          background: "var(--panel-bg)",
          border: "1px solid #e74c3c",
          padding: "28px",
          borderRadius: "12px",
          maxWidth: "420px",
          width: "90%",
          boxShadow: "0 12px 40px rgba(231, 76, 60, 0.35)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "42px", marginBottom: "12px" }}>🗑️</div>
        <h3
          className="font-cinzel"
          style={{
            color: "#e74c3c",
            marginBottom: "12px",
            fontSize: "20px",
          }}
        >
          {title}
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
          {message}
        </p>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              background: "transparent",
              color: "var(--text-main)",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "10px 16px",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              background: "linear-gradient(135deg, #c70039, #900c3f)",
              color: "#fff",
              border: "none",
              padding: "10px 16px",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "14px",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(199, 0, 57, 0.4)",
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}