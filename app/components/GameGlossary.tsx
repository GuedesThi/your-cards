import "./GameGlossary.css";

export function GameGlossary() {
  return (
    <div className="gg-card">
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

      <div className="gg-card__grid">
        <div className="gg-card__section--creature">
          <h4 style={{ color: "#e74c3c", marginTop: 0, marginBottom: "10px" }}>
            🐉 Categorias de Criatura
          </h4>
          <ul className="gg-card__list">
            <li><strong>Normal:</strong> Basta estar em sua mão para poder entrar no campo.</li>
            <li><strong>Evolução:</strong> Precisa que uma criatura sua de nível inferior esteja em campo.</li>
            <li><strong>Invocação:</strong> Requer condições específicas ou cartas de efeito para ser invocada.</li>
          </ul>

          <h4 style={{ color: "#e74c3c", marginTop: "16px", marginBottom: "10px" }}>
            ⚔️ Comportamentos
          </h4>
          <ul className="gg-card__list">
            <li><strong>🛡️Defesa:</strong> Pode interceptar um ataque para levar todo o dano.</li>
            <li><strong>⚡Ataque Rápido:</strong> Pode ser usada imediatamente no turno que entrar em campo.</li>
            <li><strong>🗡️Primeiro Toque:</strong> Causa primeiro seu dano antes de receber um contra-ataque.</li>
            <li><strong>🧘Paciente:</strong> Ganha atributos ou acumula poder a cada turno que permanece em campo.</li>
          </ul>
        </div>

        <div className="gg-card__section--effect">
          <h4 style={{ color: "#2980b9", marginTop: 0, marginBottom: "10px" }}>
            ✨ Momento de Uso (Efeitos)
          </h4>
          <ul className="gg-card__list">
            <li><strong>Turno:</strong> Só pode ser usada em seu turno.</li>
            <li><strong>Instantâneo:</strong> Pode ser usada a qualquer momento, principalmente como resposta no meio da jogada de um oponente.</li>
            <li><strong>Condição:</strong> É executada automaticamente quando uma condição específica ocorrer.</li>
          </ul>

          <h4 style={{ color: "#2980b9", marginTop: "16px", marginBottom: "10px" }}>
            ⏳ Duração do Efeito
          </h4>
          <ul className="gg-card__list">
            <li><strong>💥 Único:</strong> Ao ser executada é imediatamente descartada.</li>
            <li><strong>🔄 Contínuo:</strong> Permanece no campo até ser destruida pelo oponente.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}