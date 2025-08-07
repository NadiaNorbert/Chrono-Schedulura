import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import * as firebaseApi from '@/services/firebaseApi';
import { Goal, Task, ScrapbookEntry, UserScore, WellnessData, HealthData } from '@/services/api';

// Hook for fetching data
export function useFirebaseData<T>(
  fetchFn: (userId: string, ...args: any[]) => Promise<T>,
  dependencies: any[] = []
) {
  const { user } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setData(null);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFn(user.id, ...dependencies);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, ...dependencies]);

  const refetch = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn(user.id, ...dependencies);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}

// Hook for mutations
export function useFirebaseMutation<T, P>(
  mutationFn: (userId: string, params: P) => Promise<T>
) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (params: P): Promise<T | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await mutationFn(user.id, params);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

// Specific hooks for common operations
export const useGoals = () => {
  return useFirebaseData(firebaseApi.getGoals);
};

export const useTasks = () => {
  return useFirebaseData(firebaseApi.getTasks);
};

export const useUserScore = () => {
  return useFirebaseData(firebaseApi.getUserScore);
};

export const useScrapbookEntries = (goalId: string) => {
  return useFirebaseData(firebaseApi.getScrapbookEntries, [goalId]);
};

export const useWellnessData = (date?: string) => {
  return useFirebaseData(firebaseApi.getWellnessData, [date]);
};

export const useHealthData = (date?: string) => {
  return useFirebaseData(firebaseApi.getHealthData, [date]);
};

// Mutation hooks
export const useCreateGoal = () => {
  return useFirebaseMutation(firebaseApi.createGoal);
};

export const useUpdateGoal = () => {
  return useFirebaseMutation<Goal, { goalId: string; updates: Partial<Goal> }>(
    async (userId, { goalId, updates }) => firebaseApi.updateGoal(goalId, updates)
  );
};

export const useDeleteGoal = () => {
  return useFirebaseMutation<void, string>(
    async (userId, goalId) => firebaseApi.deleteGoal(goalId)
  );
};

export const useCreateTask = () => {
  return useFirebaseMutation(firebaseApi.createTask);
};

export const useUpdateTask = () => {
  return useFirebaseMutation<Task, { taskId: string; updates: Partial<Task> }>(
    async (userId, { taskId, updates }) => firebaseApi.updateTask(taskId, updates)
  );
};

export const useDeleteTask = () => {
  return useFirebaseMutation<void, string>(
    async (userId, taskId) => firebaseApi.deleteTask(taskId)
  );
};

export const useCreateScrapbookEntry = () => {
  return useFirebaseMutation<ScrapbookEntry, Omit<ScrapbookEntry, 'id' | 'created_at'>>(
    async (userId, entry) => firebaseApi.createScrapbookEntry(entry)
  );
};

export const useUploadScrapbookImage = () => {
  return useFirebaseMutation<string, { file: File; goalId: string }>(
    async (userId, { file, goalId }) => firebaseApi.uploadScrapbookImage(file, goalId)
  );
};