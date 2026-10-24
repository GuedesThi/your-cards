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

  const getBorderColor = () => {
    switch (type) {
      case "success":
        return "var(--gold-primary)";
      case "error":
        return "#e74c3c";
      default:
        return "#2980b9";
    }
  };

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
          border: `1px solid ${getBorderColor()}`,
          padding: "28px",
          borderRadius: "12px",
          maxWidth: "420px",
          width: "90%",
          boxShadow: `0 12px 40px ${
            type === "error" ? "rgba(231, 76, 60, 0.4)" : "rgba(243, 156, 18, 0.3)"
          }`,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "42px", marginBottom: "12px" }}>{getIcon()}</div>
        <h3
          className="font-cinzel"
          style={{
            color: getBorderColor(),
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
        <button
          onClick={onClose}
          style={{
            background:
              type === "error"
                ? "linear-gradient(135deg, #c70039, #900c3f)"
                : "linear-gradient(135deg, var(--gold-primary), #d4af37)",
            color: type === "error" ? "#fff" : "#000",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "15px",
            cursor: "pointer",
            width: "100%",
            boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
          }}
        >
          Entendido
        </button>
      </div>
    </div>
  );
}