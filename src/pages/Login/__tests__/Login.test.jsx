import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../Login";

jest.mock("firebase/auth");

describe("Login Component", () => {
  it("renders the login form", () => {
    render(<Login onLogin={jest.fn()} handleDataRefresh={jest.fn()} />);

    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("displays an error message if login fails", async () => {
    render(<Login onLogin={jest.fn()} handleDataRefresh={jest.fn()} />);

    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: "invalid@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    // Simular um erro ao autenticar
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("opens the modal when 'Cadastrar' is clicked", () => {
    render(<Login onLogin={jest.fn()} handleDataRefresh={jest.fn()} />);

    const cadastrarButton = screen.getByRole("button", { name: /cadastrar/i });
    fireEvent.click(cadastrarButton);

    expect(screen.getByText(/registerform/i)).toBeInTheDocument();
  });
});
