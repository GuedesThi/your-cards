import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import { ConfirmModal } from "./ConfirmModal";

describe("ConfirmModal Component", () => {
  it("deve renderizar o título e disparar onConfirm ao clicar no botão primário", () => {
    const handleConfirm = jest.fn();
    const handleCancel = jest.fn();

    render(
      <ConfirmModal
        title="Excluir Carta?"
        message="Deseja realmente apagar esta carta?"
        confirmText="Sim, Excluir"
        cancelText="Cancelar"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );

    expect(screen.getByText("Excluir Carta?")).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", { name: "Sim, Excluir" });
    fireEvent.click(confirmBtn);

    expect(handleConfirm).toHaveBeenCalledTimes(1);
    expect(handleCancel).not.toHaveBeenCalled();
  });
});