import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event"; // Recomendo usar userEvent para interações mais realistas
import Login from "../Login";
import { signInWithEmailAndPassword } from "firebase/auth";

// Mock do Firebase
jest.mock("firebase/auth");

describe("Login Component", () => {
  // Limpa os mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the login form correctly", () => {
    render(<Login onLogin={jest.fn()} handleDataRefresh={jest.fn()} />);

    // Verifica se todos os elementos necessários estão presentes
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /cadastrar/i })
    ).toBeInTheDocument();
  });

  it("handles successful login", async () => {
    const mockOnLogin = jest.fn();
    const mockHandleDataRefresh = jest.fn();

    render(
      <Login onLogin={mockOnLogin} handleDataRefresh={mockHandleDataRefresh} />
    );

    // Simula login bem-sucedido
    signInWithEmailAndPassword.mockResolvedValueOnce({
      user: { email: "valid@test.com" },
    });

    // Preenche os campos
    await userEvent.type(screen.getByLabelText(/e-mail/i), "valid@test.com");
    await userEvent.type(screen.getByLabelText(/senha/i), "password123");

    // Clica no botão de login
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    // Verifica se as funções foram chamadas
    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        "valid@test.com",
        "password123"
      );
      expect(mockOnLogin).toHaveBeenCalled();
      expect(mockHandleDataRefresh).toHaveBeenCalled();
    });
  });

  it("displays an error message if login fails", async () => {
    render(<Login onLogin={jest.fn()} handleDataRefresh={jest.fn()} />);

    // Simula falha no login
    signInWithEmailAndPassword.mockRejectedValueOnce(
      new Error("auth/invalid-credentials")
    );

    // Preenche os campos
    await userEvent.type(screen.getByLabelText(/e-mail/i), "invalid@test.com");
    await userEvent.type(screen.getByLabelText(/senha/i), "wrongpassword");

    // Clica no botão de login
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    // Verifica se a mensagem de erro aparece
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it("validates form fields before submission", async () => {
    render(<Login onLogin={jest.fn()} handleDataRefresh={jest.fn()} />);

    // Tenta fazer login com campos vazios
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    // Verifica se as mensagens de validação aparecem
    await waitFor(() => {
      expect(screen.getByText(/campo obrigatório/i)).toBeInTheDocument();
    });
  });

  it("opens the register modal when 'Cadastrar' is clicked", async () => {
    render(<Login onLogin={jest.fn()} handleDataRefresh={jest.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    // Verifica se o modal de registro está visível
    expect(screen.getByText(/registerform/i)).toBeInTheDocument();
  });

  it("closes the register modal when close button is clicked", async () => {
    render(<Login onLogin={jest.fn()} handleDataRefresh={jest.fn()} />);

    // Abre o modal
    await userEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    // Fecha o modal (ajuste o seletor conforme seu componente)
    const closeButton = screen.getByRole("button", { name: /fechar/i });
    await userEvent.click(closeButton);

    // Verifica se o modal foi fechado
    expect(screen.queryByText(/registerform/i)).not.toBeInTheDocument();
  });
});
