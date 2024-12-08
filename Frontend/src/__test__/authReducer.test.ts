import { AuthAction, authReducer } from '@/context/AuthContext';

describe("authReducer", () => {
  const initialState = { token: null, isAuthenticated: false };

  it("should login", () => {
    const action: AuthAction = { type: "LOGIN", token: "test-token" };
    const newState = authReducer(initialState, action);
    expect(newState.isAuthenticated).toBe(true);
    expect(newState.token).toBe("test-token");
  });

  it("should logout", () => {
    const state = { token: "some-token", isAuthenticated: true };
    const action: AuthAction = { type: "LOGOUT" };
    const newState = authReducer(state, action);
    expect(newState.isAuthenticated).toBe(false);
    expect(newState.token).toBeNull();
  });
});