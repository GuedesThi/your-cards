interface DescriptionModalProps {
  description: string;
  onClose: () => void;
}

export function DescriptionModal({ description, onClose }: DescriptionModalProps) {
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
          {description}
        </p>
        <button
          onClick={onClose}
          style={{
            background: "linear-gradient(135deg, var(--gold-primary), #d4af37)",
            color: "#000",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "15px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}