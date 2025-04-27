import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TestAuth from "../page";
import { useAuth } from "@/contexts/AuthContext";

// Mock the useAuth hook
jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("TestAuth", () => {
  const mockSignUp = jest.fn();
  const mockSignIn = jest.fn();
  const mockSignInWithGoogle = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      signUp: mockSignUp,
      signIn: mockSignIn,
      signInWithGoogle: mockSignInWithGoogle,
      logout: mockLogout,
    });
  });

  it("renders authentication form", () => {
    render(<TestAuth />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^sign in$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in with google/i })
    ).toBeInTheDocument();
  });

  it("handles sign up", async () => {
    render(<TestAuth />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const signUpButton = screen.getByRole("button", { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith("test@test.com", "password123");
    });
  });

  it("handles sign in", async () => {
    render(<TestAuth />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole("button", { name: /^sign in$/i });

    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("test@test.com", "password123");
    });
  });

  it("handles Google sign in", async () => {
    render(<TestAuth />);

    const googleButton = screen.getByRole("button", {
      name: /sign in with google/i,
    });
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(mockSignInWithGoogle).toHaveBeenCalled();
    });
  });

  it("handles sign out when user is logged in", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: "test@test.com" },
      signUp: mockSignUp,
      signIn: mockSignIn,
      signInWithGoogle: mockSignInWithGoogle,
      logout: mockLogout,
    });

    render(<TestAuth />);

    const signOutButton = screen.getByRole("button", { name: /sign out/i });
    fireEvent.click(signOutButton);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  it("displays success message after successful operation", async () => {
    render(<TestAuth />);

    const signInButton = screen.getByRole("button", { name: /^sign in$/i });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByText(/sign in successful!/i)).toBeInTheDocument();
    });
  });

  it("displays error message when operation fails", async () => {
    mockSignIn.mockRejectedValueOnce(new Error("Invalid credentials"));

    render(<TestAuth />);

    const signInButton = screen.getByRole("button", { name: /^sign in$/i });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to sign in/i)).toBeInTheDocument();
    });
  });
});
