import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";

const TestAuthComponent = () => {
  const { state, dispatch } = useAuth();
  return (
    <>
      <p data-testid="auth">
        {state.isAuthenticated ? "Authenticated" : "Not Authenticated"}
      </p>
      <button onClick={() => dispatch({ type: "LOGIN", token: "test" })}>
        Login
      </button>
    </>
  );
};

describe("useAuth", () => {
  it("should show not authenticated initially and authenticate after login", async () => {
    render(
      <AuthProvider>
        <TestAuthComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("auth").textContent).toBe("Not Authenticated");

    await act(async () => {
      await userEvent.click(screen.getByText("Login"));
    });

    expect(screen.getByTestId("auth").textContent).toBe("Authenticated");
  });
});
