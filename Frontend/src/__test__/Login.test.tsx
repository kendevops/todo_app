import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Login from "@/pages/auth/Login";
import api from "@/utils/api";
import { AuthProvider } from "@/context/AuthContext"; // Ensure correct path
import { MemoryRouter } from "react-router-dom"; // If routing is used in Login

jest.mock("@/utils/api");

function renderWithProviders(ui: React.ReactNode) {
  return render(
    <AuthProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </AuthProvider>
  );
}

describe("Login Page", () => {
  it("shows validation error if fields are empty", async () => {
    renderWithProviders(<Login />);
    const submitBtn = screen.getByText("Login");
    await userEvent.click(submitBtn);
    expect(
      await screen.findByText(/please enter a valid email/i)
    ).toBeInTheDocument();
  });

  it("logs in successfully with valid credentials", async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({
      data: { token: "fake-token" },
    });
    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitBtn = screen.getByText("Login");

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitBtn);

    expect(api.post).toHaveBeenCalledWith("/auth/login", {
      email: "test@example.com",
      password: "password123",
    });
  });

  it("shows error for invalid credentials", async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(
      new Error("Invalid credentials")
    );
    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitBtn = screen.getByText("Login");

    await userEvent.type(emailInput, "wrong@example.com");
    await userEvent.type(passwordInput, "wrongpassword");
    await userEvent.click(submitBtn);

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
