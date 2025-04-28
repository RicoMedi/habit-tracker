"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CreateHabitForm from "@/components/habits/CreateHabitForm";
import HabitList from "@/components/habits/HabitList";
import { createHabit } from "@/utils/db";
import type { HabitFormData } from "@/types/habit";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      await logout();
      router.replace("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const handleCreateHabit = async (habitData: HabitFormData) => {
    try {
      if (!user) return;

      // Immediately close the form to improve UI responsiveness
      setShowCreateForm(false);

      // Create the habit
      await createHabit(user.uid, habitData);

      // Trigger a refresh of the habit list
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error creating habit:", error);
      // If there's an error, you might want to show an error notification here
    }
  };

  const handleHabitUpdate = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              New Habit
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showCreateForm ? (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Create New Habit
              </h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <CreateHabitForm
              onSubmit={handleCreateHabit}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        ) : null}

        <HabitList
          refreshTrigger={refreshTrigger}
          onHabitUpdate={handleHabitUpdate}
        />
      </main>
    </div>
  );
}
