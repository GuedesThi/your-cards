export function GameGlossary() {
  return (
    <div
      style={{
        marginTop: "40px",
        background: "rgba(10, 10, 15, 0.85)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(212, 175, 55, 0.3)",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      <h3
        className="font-cinzel"
        style={{
          color: "var(--gold-primary)",
          fontSize: "20px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        📖 Glossário e Regras das Cartas
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {/* Seção: Criaturas */}
        <div
          style={{
            background: "rgba(0,0,0,0.4)",
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid rgba(231, 76, 60, 0.3)",
          }}
        >
          <h4 style={{ color: "#e74c3c", marginTop: 0, marginBottom: "10px" }}>
            🐉 Categorias de Criatura
          </h4>
          <ul style={listStyle}>
            <li>
              <strong>Normal:</strong> Basta estar em sua mão para poder entrar no campo.
            </li>
            <li>
              <strong>Evolução:</strong> Precisa que uma criatura sua de nível inferior esteja em campo.
            </li>
            <li>
              <strong>Invocação:</strong> Requer condições específicas ou cartas de efeito para ser invocada.
            </li>
          </ul>

          <h4 style={{ color: "#e74c3c", marginTop: "16px", marginBottom: "10px" }}>
            ⚔️ Comportamentos
          </h4>
          <ul style={listStyle}>
            <li>
              <strong>🛡️Defesa:</strong> Pode interceptar um ataque para levar todo o dano.
            </li>
            <li>
              <strong>⚡Ataque Rápido:</strong> Pode ser usada imediatamente no turno que entrar em campo.
            </li>
            <li>
              <strong>🗡️Primeiro Toque:</strong> Causa primeiro seu dano antes de receber um contra-ataque.
            </li>
            <li>
              <strong>🧘Paciente:</strong> Ganha atributos ou acumula poder a cada turno que permanece em campo.
            </li>
          </ul>
        </div>

        {/* Seção: Efeitos */}
        <div
          style={{
            background: "rgba(0,0,0,0.4)",
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid rgba(41, 128, 185, 0.3)",
          }}
        >
          <h4 style={{ color: "#2980b9", marginTop: 0, marginBottom: "10px" }}>
            ✨ Momento de Uso (Efeitos)
          </h4>
          <ul style={listStyle}>
            <li>
              <strong>Turno:</strong> Só pode ser usada em seu turno.
            </li>
            <li>
              <strong>Instantâneo:</strong> Pode ser usada a qualquer momento, principalmente como resposta no meio da jogada de um oponente.
            </li>
            <li>
              <strong>Condição:</strong> É executada automaticamente quando uma condição específica ocorrer.
            </li>
          </ul>

          <h4 style={{ color: "#2980b9", marginTop: "16px", marginBottom: "10px" }}>
            ⏳ Duração do Efeito
          </h4>
          <ul style={listStyle}>
            <li>
              <strong>💥 Único:</strong> Ao ser executada é imediatamente descartada.
            </li>
            <li>
              <strong>🔄 Contínuo:</strong> Permanece no campo até ser destruida pelo oponente.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const listStyle = {
  fontSize: "12px",
  lineHeight: "1.6",
  color: "#d0d0d0",
  paddingLeft: "18px",
  margin: 0,
};