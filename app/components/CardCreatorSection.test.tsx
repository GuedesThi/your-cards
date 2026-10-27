import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import { CardCreatorSection } from "./CardCreatorSection";

const mockUser = {
  id: "user-123",
  email: "mestre@cards.com",
  username: "MestreCard",
};

describe("CardCreatorSection Component", () => {
  it("deve alterar o nome da carta e os valores de Ataque e Defesa via slider", () => {
    render(
      <CardCreatorSection
        user={mockUser}
        editingCard={null}
        onSaveCard={jest.fn<() => Promise<void>>().mockResolvedValue()}
        onShowModal={jest.fn()}
        onRequireAuth={jest.fn()}
      />
    );

    const nameInput = screen.getByPlaceholderText("Ex: Guardião de Ouro");
    fireEvent.change(nameInput, { target: { value: "Lorde das Sombras" } });
    expect(nameInput).toHaveValue("Lorde das Sombras");

    const sliders = screen.getAllByRole("slider");
    const attackSlider = sliders[0];
    fireEvent.change(attackSlider, { target: { value: "65" } });

    expect(screen.getByText(/Ataque: \(65\)/i)).toBeInTheDocument();
  });

  it("deve ocultar os rótulos de Ataque e Defesa do formulário ao selecionar o tipo Efeito", () => {
    const { container } = render(
      <CardCreatorSection
        user={mockUser}
        editingCard={null}
        onSaveCard={jest.fn<() => Promise<void>>().mockResolvedValue()}
        onShowModal={jest.fn()}
        onRequireAuth={jest.fn()}
      />
    );

    const selects = screen.getAllByRole("combobox");
    const typeSelect = selects[0];
    fireEvent.change(typeSelect, { target: { value: "effect" } });

    // Garante que dentro do formulário (.crt-section__panel) os rótulos de Ataque/Defesa foram removidos
    const formPanel = container.querySelector(".crt-section__panel");
    expect(formPanel?.textContent).not.toContain("Ataque:");
    expect(formPanel?.textContent).not.toContain("Defesa:");
  });

  it("não deve salvar a carta se o nome estiver vazio", async () => {
    const handleSave = jest.fn<() => Promise<void>>().mockResolvedValue();
    const handleShowModal = jest.fn();

    render(
      <CardCreatorSection
        user={mockUser}
        editingCard={null}
        onSaveCard={handleSave}
        onShowModal={handleShowModal}
        onRequireAuth={jest.fn()}
      />
    );

    const saveButton = screen.getByRole("button", { name: /Salvar na Biblioteca/i });
    fireEvent.click(saveButton);

    // Garante que o salvamento no banco/estado não foi acionado sem o preenchimento do nome
    expect(handleSave).not.toHaveBeenCalled();
  });
});