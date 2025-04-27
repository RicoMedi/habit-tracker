import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "../AuthContext";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// Mock Firebase auth
jest.mock("@/lib/firebase", () => ({
  auth: {
    currentUser: null,
  },
}));

// Mock Firebase auth functions
jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn(); // Return unsubscribe function
  }),
  GoogleAuthProvider: jest.fn(() => ({})),
  signInWithPopup: jest.fn(),
}));

// Mock Firestore functions
jest.mock("@/lib/db", () => ({
  createUserProfile: jest.fn(),
  getUserProfile: jest.fn(),
}));

// Test component to access auth context
const TestComponent = () => {
  const { user, signUp, signIn, logout } = useAuth();
  return (
    <div>
      <div data-testid="user-status">
        {user ? "Logged in" : "Not logged in"}
      </div>
      <button onClick={() => signUp("test@test.com", "password")}>
        Sign Up
      </button>
      <button onClick={() => signIn("test@test.com", "password")}>
        Sign In
      </button>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("provides authentication context to children", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("user-status")).toHaveTextContent(
      "Not logged in"
    );
  });

  it("handles sign up", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: { uid: "123", email: "test@test.com" },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText("Sign Up"));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        "test@test.com",
        "password"
      );
    });
  });

  it("handles sign in", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: { uid: "123", email: "test@test.com" },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText("Sign In"));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        "test@test.com",
        "password"
      );
    });
  });

  it("handles sign out", async () => {
    (signOut as jest.Mock).mockResolvedValueOnce();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText("Sign Out"));

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledWith(auth);
    });
  });
});
