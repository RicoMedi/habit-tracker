"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Habit,
  getUserHabits,
  markHabitComplete,
  deleteHabit,
  getHabitCompletions,
} from "@/utils/db";
import { format, isToday, startOfDay } from "date-fns";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface HabitStats {
  totalHabits: number;
  completedToday: number;
  completionRate: number;
  dailyHabits: number;
  weeklyHabits: number;
}

export default function HabitList() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const [stats, setStats] = useState<HabitStats>({
    totalHabits: 0,
    completedToday: 0,
    completionRate: 0,
    dailyHabits: 0,
    weeklyHabits: 0,
  });

  const loadHabits = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const userHabits = await getUserHabits(user.uid);
      setHabits(userHabits);

      // Calculate statistics
      const dailyHabits = userHabits.filter(
        (h) => h.frequency === "daily"
      ).length;
      const weeklyHabits = userHabits.filter(
        (h) => h.frequency === "weekly"
      ).length;

      // Get today's completions
      const completedToday = await Promise.all(
        userHabits.map(async (habit) => {
          const completions = await getHabitCompletions(
            habit.id,
            user.uid,
            startOfDay(new Date()),
            new Date()
          );
          return completions.some((c) => isToday(c.completedAt.toDate()));
        })
      );

      const todayCount = completedToday.filter(Boolean).length;

      setStats({
        totalHabits: userHabits.length,
        completedToday: todayCount,
        completionRate: userHabits.length
          ? (todayCount / userHabits.length) * 100
          : 0,
        dailyHabits,
        weeklyHabits,
      });
    } catch (error) {
      console.error("Error loading habits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
  }, [user]);

  const handleComplete = async (habitId: string) => {
    if (!user) return;
    try {
      await markHabitComplete(user.uid, habitId);
      await loadHabits();
    } catch (error) {
      console.error("Error completing habit:", error);
    }
  };

  const handleDeleteClick = (habitId: string) => {
    setHabitToDelete(habitId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!habitToDelete) return;
    try {
      await deleteHabit(habitToDelete);
      await loadHabits();
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
    setHabitToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          No habits yet
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Get started by creating your first habit!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Today's Progress
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stats.completedToday}/{stats.totalHabits}
            </span>
            <span className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
              {stats.completionRate.toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Daily Habits
          </h3>
          <span className="text-3xl font-bold text-green-600 dark:text-green-400">
            {stats.dailyHabits}
          </span>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Weekly Habits
          </h3>
          <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {stats.weeklyHabits}
          </span>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Completion Streak
          </h3>
          <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            Coming Soon
          </span>
        </div>
      </div>

      {/* Habits List */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 relative"
            style={{ borderLeft: `8px solid ${habit.color}` }}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {habit.title}
                </h3>
                <p className="text-base text-gray-600 dark:text-gray-400 mb-4">
                  {habit.description}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleComplete(habit.id)}
                  className="p-3 bg-green-100 text-green-600 rounded-full hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 transition-colors"
                  title="Mark as complete"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteClick(habit.id)}
                  className="p-3 bg-red-100 text-red-600 rounded-full hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors"
                  title="Delete habit"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="text-base text-gray-600 dark:text-gray-400 space-y-2">
              <p className="flex items-center">
                <span className="font-medium mr-2">Frequency:</span>
                {habit.frequency === "daily" ? "Daily" : "Weekly"}
              </p>
              {habit.frequency === "weekly" && (
                <p className="flex items-center">
                  <span className="font-medium mr-2">Days:</span>
                  {habit.selectedDays.join(", ")}
                </p>
              )}
              <p className="flex items-center">
                <span className="font-medium mr-2">Started:</span>
                {format(new Date(habit.startDate), "MMM d, yyyy")}
              </p>
              {habit.reminderTime && (
                <p className="flex items-center">
                  <span className="font-medium mr-2">Reminder:</span>
                  {habit.reminderTime}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setHabitToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Habit"
        message="Are you sure you want to delete this habit? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
