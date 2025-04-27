"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createUserProfile, getUserProfile } from "@/lib/db";
import { Timestamp } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          // Check if user profile exists, if not create it
          const profile = await getUserProfile(user.uid);
          if (!profile) {
            await createUserProfile({
              uid: user.uid,
              email: user.email!,
              displayName: user.displayName || undefined,
              createdAt: Timestamp.now(),
              lastLogin: Timestamp.now(),
              settings: {
                theme: "system",
                startOfWeek: 1,
                notifications: true,
              },
            });
          }
        } catch (error) {
          console.error("Error managing user profile:", error);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Wait for the auth state to change and the user to be set
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        await createUserProfile({
          uid: userCredential.user.uid,
          email: userCredential.user.email!,
          displayName: userCredential.user.displayName || undefined,
          createdAt: Timestamp.now(),
          lastLogin: Timestamp.now(),
          settings: {
            theme: "system",
            startOfWeek: 1,
            notifications: true,
          },
        });
      } catch (error) {
        console.error("Error creating user profile:", error);
        // If profile creation fails, we should delete the auth user
        await userCredential.user.delete();
        throw new Error("Failed to create user profile");
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error during sign in:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      // Wait for the auth state to change and the user to be set
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        const profile = await getUserProfile(userCredential.user.uid);
        if (!profile) {
          await createUserProfile({
            uid: userCredential.user.uid,
            email: userCredential.user.email!,
            displayName: userCredential.user.displayName || undefined,
            createdAt: Timestamp.now(),
            lastLogin: Timestamp.now(),
            settings: {
              theme: "system",
              startOfWeek: 1,
              notifications: true,
            },
          });
        }
      } catch (error) {
        console.error("Error creating user profile:", error);
        throw new Error("Failed to create user profile");
      }
    } catch (error) {
      console.error("Error during Google sign in:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Error during password reset:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
