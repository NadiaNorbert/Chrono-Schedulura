import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '@/config/firebase';
import { Goal, Task, Milestone, ScrapbookEntry, UserScore, WellnessData, HealthData } from './api';

// Goals
export const getGoals = async (userId: string): Promise<Goal[]> => {
  const q = query(
    collection(db, 'goals'),
    where('user_id', '==', userId),
    orderBy('created_at', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal));
};

export const createGoal = async (userId: string, goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Goal> => {
  const goalData = {
    ...goal,
    user_id: userId,
    created_at: Timestamp.now().toDate().toISOString(),
    updated_at: Timestamp.now().toDate().toISOString()
  };
  const docRef = await addDoc(collection(db, 'goals'), goalData);
  return { id: docRef.id, ...goalData } as Goal;
};

export const updateGoal = async (goalId: string, updates: Partial<Goal>): Promise<Goal> => {
  const goalRef = doc(db, 'goals', goalId);
  const updateData = {
    ...updates,
    updated_at: Timestamp.now().toDate().toISOString()
  };
  await updateDoc(goalRef, updateData);
  return { id: goalId, ...updates } as Goal;
};

export const deleteGoal = async (goalId: string): Promise<void> => {
  await deleteDoc(doc(db, 'goals', goalId));
};

// Tasks
export const getTasks = async (userId: string): Promise<Task[]> => {
  const q = query(
    collection(db, 'tasks'),
    where('user_id', '==', userId),
    orderBy('created_at', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
};

export const createTask = async (userId: string, task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Task> => {
  const taskData = {
    ...task,
    user_id: userId,
    created_at: Timestamp.now().toDate().toISOString(),
    updated_at: Timestamp.now().toDate().toISOString()
  };
  const docRef = await addDoc(collection(db, 'tasks'), taskData);
  return { id: docRef.id, ...taskData } as Task;
};

export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<Task> => {
  const taskRef = doc(db, 'tasks', taskId);
  const updateData = {
    ...updates,
    updated_at: Timestamp.now().toDate().toISOString()
  };
  await updateDoc(taskRef, updateData);
  return { id: taskId, ...updates } as Task;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await deleteDoc(doc(db, 'tasks', taskId));
};

// Scrapbook Entries
export const getScrapbookEntries = async (goalId: string): Promise<ScrapbookEntry[]> => {
  const q = query(
    collection(db, 'scrapbook_entries'),
    where('goal_id', '==', goalId),
    orderBy('created_at', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScrapbookEntry));
};

export const createScrapbookEntry = async (entry: Omit<ScrapbookEntry, 'id' | 'created_at'>): Promise<ScrapbookEntry> => {
  const entryData = {
    ...entry,
    created_at: Timestamp.now().toDate().toISOString()
  };
  const docRef = await addDoc(collection(db, 'scrapbook_entries'), entryData);
  return { id: docRef.id, ...entryData } as ScrapbookEntry;
};

// File Upload for Scrapbook
export const uploadScrapbookImage = async (file: File, goalId: string): Promise<string> => {
  const timestamp = Date.now();
  const fileName = `scrapbook/${goalId}/${timestamp}_${file.name}`;
  const imageRef = ref(storage, fileName);
  
  await uploadBytes(imageRef, file);
  return await getDownloadURL(imageRef);
};

export const deleteScrapbookImage = async (imageUrl: string): Promise<void> => {
  const imageRef = ref(storage, imageUrl);
  await deleteObject(imageRef);
};

// User Score
export const getUserScore = async (userId: string): Promise<UserScore> => {
  // Calculate score based on goals and tasks
  const goals = await getGoals(userId);
  const tasks = await getTasks(userId);
  
  const goalsCompleted = goals.filter(g => g.current_value >= g.target_value).length;
  const goalsCreated = goals.length;
  
  // Calculate milestones completed
  let milestonesCompleted = 0;
  goals.forEach(goal => {
    if (goal.milestones) {
      milestonesCompleted += goal.milestones.filter(m => m.completed).length;
    }
  });
  
  const totalPoints = (goalsCreated * 10) + (milestonesCompleted * 5) + (goalsCompleted * 50);
  
  return {
    total_points: totalPoints,
    goals_completed: goalsCompleted,
    milestones_completed: milestonesCompleted,
    goals_created: goalsCreated
  };
};

// Wellness Data
export const getWellnessData = async (userId: string, date?: string): Promise<WellnessData[]> => {
  let q = query(
    collection(db, 'wellness_data'),
    where('user_id', '==', userId)
  );
  
  if (date) {
    q = query(q, where('date', '==', date));
  }
  
  q = query(q, orderBy('date', 'desc'));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WellnessData));
};

export const updateWellnessData = async (userId: string, data: Omit<WellnessData, 'id' | 'user_id'>): Promise<WellnessData> => {
  const wellnessData = {
    ...data,
    user_id: userId
  };
  const docRef = await addDoc(collection(db, 'wellness_data'), wellnessData);
  return { id: docRef.id, ...wellnessData } as WellnessData;
};

// Health Data
export const getHealthData = async (userId: string, date?: string): Promise<HealthData[]> => {
  let q = query(
    collection(db, 'health_data'),
    where('user_id', '==', userId)
  );
  
  if (date) {
    q = query(q, where('date', '==', date));
  }
  
  q = query(q, orderBy('date', 'desc'));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HealthData));
};

export const updateHealthData = async (userId: string, data: Omit<HealthData, 'id' | 'user_id'>): Promise<HealthData> => {
  const healthData = {
    ...data,
    user_id: userId
  };
  const docRef = await addDoc(collection(db, 'health_data'), healthData);
  return { id: docRef.id, ...healthData } as HealthData;
};