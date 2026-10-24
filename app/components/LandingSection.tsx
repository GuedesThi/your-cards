import "./LandingSection.css";

interface LandingSectionProps {
  onStartClick: () => void;
}

export function LandingSection({ onStartClick }: LandingSectionProps) {
  return (
    <div className="lnd-container">
      <h2 className="font-cinzel lnd-container__title">
        Forje Suas Próprias Cartas de Duelo
      </h2>
      <p className="lnd-container__desc">
        Crie criaturas, feitiços e estratégias customizadas com imagens, ajustes de enquadramento, atributos e salvamento seguro em banco de dados.
      </p>
      <button onClick={onStartClick} className="lnd-container__start-btn">
        Começar a Criar Agora 🚀
      </button>
    </div>
  );
}