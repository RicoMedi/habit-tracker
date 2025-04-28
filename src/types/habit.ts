export interface HabitFormData {
  title: string;
  description: string;
  frequency: "daily" | "weekly";
  selectedDays: string[];
  color: string;
  startDate: string;
  reminderTime?: string;
}
