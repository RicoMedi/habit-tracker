"use client";

import { useState } from "react";
import Drawer from "@/components/ui/Drawer";
import { deleteHabit } from "@/utils/db";
import { Habit } from "@/utils/db";

interface DeleteHabitDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  habit: Habit | null;
  onDelete: (habitId: string) => void;
}

export default function DeleteHabitDrawer({
  isOpen,
  onClose,
  habit,
  onDelete,
}: DeleteHabitDrawerProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!habit) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      onDelete(habit.id);
      onClose();

      await deleteHabit(habit.id);
    } catch (err) {
      
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Delete Habit">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            {habit.title}
          </h3>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this habit? This action cannot be
            undone.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md">
            {error}
          </div>
        )}

        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-end">
          <button
            type="button"
            disabled={isDeleting}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
            onClick={handleDelete}
          >
            {isDeleting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Deleting
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>

        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
            Habit Details
          </h4>
          <dl className="grid grid-cols-1 gap-y-3 text-sm">
            <div>
              <dt className="font-medium text-gray-500 dark:text-gray-400">
                Description
              </dt>
              <dd className="mt-1 text-gray-900 dark:text-white">
                {habit.description || "No description"}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500 dark:text-gray-400">
                Frequency
              </dt>
              <dd className="mt-1 text-gray-900 dark:text-white">
                {habit.frequency === "daily" ? "Daily" : "Weekly"}
              </dd>
            </div>
            {habit.frequency === "weekly" && (
              <div>
                <dt className="font-medium text-gray-500 dark:text-gray-400">
                  Days
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-white">
                  {habit.selectedDays.join(", ")}
                </dd>
              </div>
            )}
            <div>
              <dt className="font-medium text-gray-500 dark:text-gray-400">
                Started
              </dt>
              <dd className="mt-1 text-gray-900 dark:text-white">
                {new Date(habit.startDate).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </Drawer>
  );
}
