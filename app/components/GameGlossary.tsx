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
              <strong>Normal:</strong> Entrada direta no campo sem custo de tributo ou requisito especial.
            </li>
            <li>
              <strong>Evolução:</strong> Precisa ser jogada por cima de uma criatura existente do mesmo tipo.
            </li>
            <li>
              <strong>Invocação:</strong> Requer rituais ou gatilhos especiais de jogo para ser invocada.
            </li>
          </ul>

          <h4 style={{ color: "#e74c3c", marginTop: "16px", marginBottom: "10px" }}>
            ⚔️ Comportamentos
          </h4>
          <ul style={listStyle}>
            <li>
              <strong>🛡️ Defesa:</strong> Foco em absorção de dano e proteção táctica de vida.
            </li>
            <li>
              <strong>⚡ Ataque Rápido:</strong> Pode atacar imediatamente no mesmo turno em que entra em jogo.
            </li>
            <li>
              <strong>🗡️ Primeiro Toque:</strong> Causa seu dano antes de receber o contra-ataque do alvo.
            </li>
            <li>
              <strong>🧘 Paciente:</strong> Ganha atributos ou acumula poder a cada turno que permanece em campo.
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
              <strong>Turno:</strong> Ativado apenas durante a sua própria fase principal de jogada.
            </li>
            <li>
              <strong>Instantâneo:</strong> Pode ser usado como resposta no meio da jogada do oponente.
            </li>
            <li>
              <strong>Condição:</strong> Dispara automaticamente quando um evento específico acontece na partida.
            </li>
          </ul>

          <h4 style={{ color: "#2980b9", marginTop: "16px", marginBottom: "10px" }}>
            ⏳ Duração do Efeito
          </h4>
          <ul style={listStyle}>
            <li>
              <strong>💥 Único:</strong> Resolve sua habilidade e vai imediatamente para o descarte.
            </li>
            <li>
              <strong>🔄 Contínuo:</strong> Permanece no campo modificando o jogo de forma permanente.
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