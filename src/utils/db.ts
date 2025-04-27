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
  setDoc,
  getDoc,
} from "firebase/firestore";

// User interfaces and functions
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: Timestamp;
  lastLogin: Timestamp;
  settings: {
    theme: "light" | "dark" | "system";
    startOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, etc.
    notifications: boolean;
    quietHoursStart?: string;
    quietHoursEnd?: string;
  };
}

// User Profile Operations
export const createUserProfile = async (user: User) => {
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    ...user,
    settings: {
      theme: "system",
      startOfWeek: 1, // Monday
      notifications: true,
    },
  });
};

export const getUserProfile = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? (userSnap.data() as User) : null;
};

export const updateUserProfile = async (uid: string, data: Partial<User>) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { ...data, updatedAt: Timestamp.now() });
};

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
  try {
    // Delete the habit first
    const habitRef = doc(db, "habits", habitId);
    await deleteDoc(habitRef);

    // Then try to delete completions silently (no error logs)
    try {
      const completionsRef = collection(db, "habit_completions");
      const q = query(completionsRef, where("habitId", "==", habitId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length > 0) {
        const deletePromises = querySnapshot.docs.map((doc) =>
          deleteDoc(doc.ref)
        );
        await Promise.all(deletePromises);
      }
    } catch {
      // Silently continue if completion deletion fails
    }

    return true;
  } catch (error) {
    throw error;
  }
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
    ...(notes && { notes }),
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
  const constraints = [
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
