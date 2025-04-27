import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  addDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

// Types
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

export interface Habit {
  id: string;
  userId: string;
  title: string;
  description?: string;
  frequency: {
    type: "daily" | "weekly";
    days?: number[]; // 0-6 for weekly habits
  };
  color?: string;
  icon?: string;
  startDate: Timestamp;
  reminderTime?: string;
  isArchived: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  category?: string;
  order: number;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  userId: string;
  date: Timestamp;
  completed: boolean;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Streak {
  id: string;
  habitId: string;
  userId: string;
  startDate: Timestamp;
  endDate: Timestamp;
  length: number;
  isActive: boolean;
  updatedAt: Timestamp;
}

// User Functions
export async function createUserProfile(user: User) {
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    ...user,
    settings: {
      theme: "system",
      startOfWeek: 1, // Monday
      notifications: true,
    },
  });
}

export async function getUserProfile(uid: string) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? (userSnap.data() as User) : null;
}

export async function updateUserProfile(uid: string, data: Partial<User>) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { ...data, updatedAt: Timestamp.now() });
}

// Habit Functions
export async function createHabit(habit: Omit<Habit, "id">) {
  const habitsRef = collection(db, "habits");
  const docRef = await addDoc(habitsRef, {
    ...habit,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    isArchived: false,
  });
  return { ...habit, id: docRef.id };
}

export async function getUserHabits(userId: string, includeArchived: boolean) {
  const constraints = [
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  ];

  if (!includeArchived) {
    constraints.push(where("isArchived", "==", false));
  }

  const habitsRef = collection(db, "habits");
  const q = query(habitsRef, ...constraints);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) => ({ ...doc.data(), id: doc.id } as Habit)
  );
}

export async function updateHabit(habitId: string, data: Partial<Habit>) {
  const habitRef = doc(db, "habits", habitId);
  await updateDoc(habitRef, { ...data, updatedAt: Timestamp.now() });
}

export async function archiveHabit(habitId: string) {
  const habitRef = doc(db, "habits", habitId);
  await updateDoc(habitRef, {
    isArchived: true,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteHabit(habitId: string) {
  const habitRef = doc(db, "habits", habitId);
  await deleteDoc(habitRef);
}

// Habit Completion Functions
export async function toggleHabitCompletion(
  completion: Omit<HabitCompletion, "id">
) {
  const completionsRef = collection(db, "completions");
  const q = query(
    completionsRef,
    where("habitId", "==", completion.habitId),
    where("date", "==", completion.date)
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    const docRef = await addDoc(completionsRef, {
      ...completion,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return { ...completion, id: docRef.id };
  } else {
    const existingDoc = querySnapshot.docs[0];
    await updateDoc(existingDoc.ref, {
      completed: !existingDoc.data().completed,
      updatedAt: Timestamp.now(),
    });
    return {
      ...existingDoc.data(),
      completed: !existingDoc.data().completed,
    } as HabitCompletion;
  }
}

export async function getHabitCompletions(
  habitId: string,
  startDate: Date,
  endDate: Date
) {
  const completionsRef = collection(db, "completions");
  const q = query(
    completionsRef,
    where("habitId", "==", habitId),
    where("date", ">=", Timestamp.fromDate(startDate)),
    where("date", "<=", Timestamp.fromDate(endDate))
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) => ({ ...doc.data(), id: doc.id } as HabitCompletion)
  );
}

// Streak Functions
export async function updateStreak(streak: Omit<Streak, "id">) {
  const streaksRef = collection(db, "streaks");
  const q = query(
    streaksRef,
    where("habitId", "==", streak.habitId),
    where("isActive", "==", true)
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    const docRef = await addDoc(streaksRef, {
      ...streak,
      updatedAt: Timestamp.now(),
    });
    return { ...streak, id: docRef.id };
  } else {
    const existingDoc = querySnapshot.docs[0];
    await updateDoc(existingDoc.ref, {
      endDate: streak.endDate,
      length: streak.length,
      updatedAt: Timestamp.now(),
    });
    return {
      ...existingDoc.data(),
      endDate: streak.endDate,
      length: streak.length,
    } as Streak;
  }
}

export async function getActiveStreak(habitId: string) {
  const streaksRef = collection(db, "streaks");
  const q = query(
    streaksRef,
    where("habitId", "==", habitId),
    where("isActive", "==", true)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty
    ? null
    : ({
        ...querySnapshot.docs[0].data(),
        id: querySnapshot.docs[0].id,
      } as Streak);
}

// Statistics Functions
export async function getDailyStats(userId: string, date: Date) {
  const completionsRef = collection(db, "completions");
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const q = query(
    completionsRef,
    where("userId", "==", userId),
    where("date", ">=", Timestamp.fromDate(startOfDay)),
    where("date", "<=", Timestamp.fromDate(endOfDay))
  );

  const querySnapshot = await getDocs(q);
  const completions = querySnapshot.docs.map((doc) => doc.data());

  return {
    total: completions.length,
    completed: completions.filter((c) => c.completed).length,
    percentage:
      completions.length > 0
        ? (completions.filter((c) => c.completed).length / completions.length) *
          100
        : 0,
  };
}
