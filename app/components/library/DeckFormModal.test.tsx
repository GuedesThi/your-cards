import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import { DeckFormModal } from "./DeckFormModal";
import { Deck } from "../../types";

const mockEditingDeck: Deck = {
  id: "deck-123",
  name: "Deck de Dragões",
  description: "Foco em ataque rápido e invocações.",
  imageUrl: "https://exemplo.com/dragoes.png",
  cards: [],
};

describe("DeckFormModal Component", () => {
  it("deve preencher os campos corretamente no modo de criação e disparar onSubmit", async () => {
    const handleSubmit = jest
      .fn<(name: string, description: string, imageUrl?: string) => Promise<void>>()
      .mockResolvedValue();
    const handleClose = jest.fn();

    render(<DeckFormModal editingDeck={null} onClose={handleClose} onSubmit={handleSubmit} />);

    // Seleciona pelos placeholders reais do componente
    const nameInput = screen.getByPlaceholderText(/Real Madrid/i);
    const descInput = screen.getByPlaceholderText(/estratégia ou tema/i);

    fireEvent.change(nameInput, { target: { value: "Deck de Magos" } });
    fireEvent.change(descInput, { target: { value: "Uso massivo de cartas de efeito." } });

    // Seleciona pelo texto real do botão ("Salvar Deck")
    const submitBtn = screen.getByRole("button", { name: /Salvar Deck/i });
    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledWith("Deck de Magos", "Uso massivo de cartas de efeito.", "");
  });

  it("deve carregar os dados existentes no modo de edição", () => {
    const handleSubmit = jest
      .fn<(name: string, description: string, imageUrl?: string) => Promise<void>>()
      .mockResolvedValue();

    render(<DeckFormModal editingDeck={mockEditingDeck} onClose={jest.fn()} onSubmit={handleSubmit} />);

    expect(screen.getByDisplayValue("Deck de Dragões")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Foco em ataque rápido e invocações.")).toBeInTheDocument();
  });
});