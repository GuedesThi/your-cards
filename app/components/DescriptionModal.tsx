import "./DescriptionModal.css";

interface DescriptionModalProps {
  description: string;
  onClose: () => void;
}

export function DescriptionModal({ description, onClose }: DescriptionModalProps) {
  return (
    <div className="dsc-modal-overlay">
      <div className="dsc-modal-content">
        <h3 className="font-cinzel dsc-modal__title">
          Descrição Completa
        </h3>
        <p className="dsc-modal__text">{description}</p>
        <button onClick={onClose} className="dsc-modal__btn">
          Fechar
        </button>
      </div>
    </div>
  );
}