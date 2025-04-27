import { db } from "@/config/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  orderBy,
} from "firebase/firestore";

export interface Habit {
  id: string;
  userId: string;
  title: string;
  description: string;
  frequency: "daily" | "weekly";
  selectedDays: string[];
  color: string;
  startDate: string;
  reminderTime?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  userId: string;
  completedAt: Timestamp;
  notes?: string;
}

// Habits Collection Operations
export const createHabit = async (
  userId: string,
  habitData: Omit<Habit, "id" | "userId" | "createdAt" | "updatedAt">
) => {
  const habitsRef = collection(db, "habits");
  const now = Timestamp.now();

  const newHabit = {
    ...habitData,
    userId,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(habitsRef, newHabit);
  return { id: docRef.id, ...newHabit };
};

export const getUserHabits = async (userId: string) => {
  try {
    const habitsRef = collection(db, "habits");
    const q = query(
      habitsRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Habit[];
  } catch (error) {
    console.error("Error fetching habits:", error);
    return [];
  }
};

export const updateHabit = async (
  habitId: string,
  updates: Partial<Omit<Habit, "id" | "userId" | "createdAt">>
) => {
  const habitRef = doc(db, "habits", habitId);
  const updatedData = {
    ...updates,
    updatedAt: Timestamp.now(),
  };
  await updateDoc(habitRef, updatedData);
};

export const deleteHabit = async (habitId: string) => {
  const habitRef = doc(db, "habits", habitId);
  await deleteDoc(habitRef);
};

// Habit Completions Collection Operations
export const markHabitComplete = async (
  userId: string,
  habitId: string,
  notes?: string
) => {
  const completionsRef = collection(db, "habit_completions");
  const completion = {
    habitId,
    userId,
    completedAt: Timestamp.now(),
    notes,
  };

  const docRef = await addDoc(completionsRef, completion);
  return { id: docRef.id, ...completion };
};

export const getHabitCompletions = async (
  habitId: string,
  userId: string,
  startDate?: Date,
  endDate?: Date
) => {
  const completionsRef = collection(db, "habit_completions");
  let constraints = [
    where("habitId", "==", habitId),
    where("userId", "==", userId),
    orderBy("completedAt", "desc"),
  ];

  if (startDate) {
    constraints.push(where("completedAt", ">=", Timestamp.fromDate(startDate)));
  }

  if (endDate) {
    constraints.push(where("completedAt", "<=", Timestamp.fromDate(endDate)));
  }

  const q = query(completionsRef, ...constraints);
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as HabitCompletion[];
};

export const deleteHabitCompletion = async (completionId: string) => {
  const completionRef = doc(db, "habit_completions", completionId);
  await deleteDoc(completionRef);
};
