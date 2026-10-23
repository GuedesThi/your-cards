interface LandingSectionProps {
  onStartClick: () => void;
}

export function LandingSection({ onStartClick }: LandingSectionProps) {
  return (
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
        Crie criaturas, feitiços e estratégias customizadas com imagens, ajustes de enquadramento, atributos e salvamento seguro em banco de dados.
      </p>
      <button
        onClick={onStartClick}
        style={{
          background: "linear-gradient(135deg, var(--gold-primary), #d4af37)",
          color: "#000",
          border: "none",
          padding: "12px 24px",
          borderRadius: "8px",
          fontWeight: "bold",
          fontSize: "15px",
          cursor: "pointer",
          boxShadow: "0 4px 14px rgba(243, 156, 18, 0.3)",
        }}
      >
        Começar a Criar Agora 🚀
      </button>
    </div>
  );
}