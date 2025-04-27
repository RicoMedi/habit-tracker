"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface HabitFormData {
  title: string;
  description: string;
  frequency: "daily" | "weekly";
  selectedDays: string[];
  color: string;
  startDate: string;
  reminderTime?: string;
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const COLORS = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#FF33F6",
  "#33FFF6",
  "#F6FF33",
  "#FF8333",
];

export default function CreateHabitForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: HabitFormData) => Promise<void>;
  onCancel: () => void;
}) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<HabitFormData>({
    title: "",
    description: "",
    frequency: "daily",
    selectedDays: [],
    color: COLORS[0],
    startDate: new Date().toISOString().split("T")[0],
    reminderTime: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await onSubmit(formData);
  };

  const toggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter((d) => d !== day)
        : [...prev.selectedDays, day],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Title *
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Frequency
        </label>
        <div className="mt-2 space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="daily"
              checked={formData.frequency === "daily"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  frequency: e.target.value as "daily" | "weekly",
                }))
              }
              className="form-radio text-blue-600"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Daily</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="weekly"
              checked={formData.frequency === "weekly"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  frequency: e.target.value as "daily" | "weekly",
                }))
              }
              className="form-radio text-blue-600"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">
              Weekly
            </span>
          </label>
        </div>
      </div>

      {formData.frequency === "weekly" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Days
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {DAYS_OF_WEEK.map((day) => (
              <label key={day} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={formData.selectedDays.includes(day)}
                  onChange={() => toggleDay(day)}
                  className="form-checkbox text-blue-600"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {day}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Color
        </label>
        <div className="flex space-x-2">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, color }))}
              className={`w-8 h-8 rounded-full ${
                formData.color === color
                  ? "ring-2 ring-offset-2 ring-blue-500"
                  : ""
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="startDate"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Start Date
        </label>
        <input
          type="date"
          id="startDate"
          value={formData.startDate}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, startDate: e.target.value }))
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label
          htmlFor="reminderTime"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Reminder Time (Optional)
        </label>
        <input
          type="time"
          id="reminderTime"
          value={formData.reminderTime}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, reminderTime: e.target.value }))
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create Habit
        </button>
      </div>
    </form>
  );
}
