import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import { CardsGrid } from "./CardsGrid";
import { Card } from "../../types";

const mockCards: Card[] = [
  {
    id: "1",
    name: "Dragão de Fogo",
    type: "creature",
    attack: 80,
    defense: 50,
    description: "Causa dano elevado.",
    imageUrl: "https://exemplo.com/dragao.png",
    scale: 1,
    posX: 0,
    posY: 0,
  },
];

describe("CardsGrid Component", () => {
  it("deve exibir mensagem de estado vazio quando não houver cartas na coleção", () => {
    render(
      <CardsGrid
        user={{ id: "u1" }}
        cards={[]}
        onShowModal={jest.fn()}
        onEditCard={jest.fn()}
        onDeleteCard={jest.fn<(card: Card) => Promise<void>>().mockResolvedValue()}
      />
    );

    expect(screen.getByText(/Nenhuma carta encontrada/i)).toBeInTheDocument();
  });

  it("deve salvar a opção de ordenação no localStorage ao alterar o select", () => {
    render(
      <CardsGrid
        user={{ id: "u1" }}
        cards={mockCards}
        onShowModal={jest.fn()}
        onEditCard={jest.fn()}
        onDeleteCard={jest.fn<(card: Card) => Promise<void>>().mockResolvedValue()}
      />
    );

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "name_asc" } });

    expect(localStorage.getItem("librarySortOption")).toBe("name_asc");
  });
});