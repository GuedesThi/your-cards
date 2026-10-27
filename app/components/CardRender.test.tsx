import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import { CardRender } from "./CardRender";
import { Card } from "../types";

const mockCreatureCard: Card = {
  id: "c1",
  name: "Guerreiro de Aço",
  type: "creature",
  attack: 75,
  defense: 50,
  description: "Avança na linha de frente com uma força devastadora capaz de derrubar portões e quebrar escudos inimigos.",
  imageUrl: "https://exemplo.com/guerreiro.png",
  scale: 1,
  posX: 0,
  posY: 0,
  creatureSubtype: "normal",
  creatureBehavior: "quick_attack",
};

const mockEffectCard: Card = {
  id: "c2",
  name: "Barreira Mística",
  type: "effect",
  attack: 0,
  defense: 0,
  description: "Anula o próximo ataque inimigo.",
  imageUrl: "https://exemplo.com/barreira.png",
  scale: 1,
  posX: 0,
  posY: 0,
  effectTiming: "instant",
  effectDuration: "single",
};

describe("CardRender Component", () => {
  it("deve renderizar atributos e badges de uma carta do tipo Criatura", () => {
    render(<CardRender card={mockCreatureCard} onShowMore={jest.fn()} />);

    expect(screen.getByText("Guerreiro de Aço")).toBeInTheDocument();
    expect(screen.getByTitle("Ataque")).toHaveTextContent("75");
    expect(screen.getByTitle("Defesa")).toHaveTextContent("50");
  });

  it("não deve exibir valores de ataque e defesa se for uma carta do tipo Efeito", () => {
    render(<CardRender card={mockEffectCard} onShowMore={jest.fn()} />);

    expect(screen.getByText("Barreira Mística")).toBeInTheDocument();
    expect(screen.queryByTitle("Ataque")).not.toBeInTheDocument();
    expect(screen.queryByTitle("Defesa")).not.toBeInTheDocument();
  });

  it("deve exibir o botão 'Mostrar tudo' quando houver transbordo de texto e disparar onShowMore", () => {
    const handleShowMore = jest.fn();

    // Mock das propriedades de altura do jsdom para simular overflow de texto
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      configurable: true,
      value: 100,
    });
    Object.defineProperty(HTMLElement.prototype, "clientHeight", {
      configurable: true,
      value: 40,
    });

    render(<CardRender card={mockCreatureCard} onShowMore={handleShowMore} />);

    // Dispara o evento de resize para que o useEffect reavalie o overflow
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    const showMoreButton = screen.getByRole("button", { name: /mostrar tudo/i });
    expect(showMoreButton).toBeInTheDocument();

    fireEvent.click(showMoreButton);

    expect(handleShowMore).toHaveBeenCalledWith(mockCreatureCard.description);
  });
});