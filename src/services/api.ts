const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  category: 'daily' | 'weekly' | 'monthly';
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  order: number;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  target_value: number;
  current_value: number;
  unit: string;
  deadline?: string;
  category?: string;
  milestones?: Milestone[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface ScrapbookEntry {
  id: string;
  goal_id: string;
  image_url?: string;
  caption: string;
  notes?: string;
  created_at: string;
}

export interface UserScore {
  total_points: number;
  goals_completed: number;
  milestones_completed: number;
  goals_created: number;
}

export interface WellnessData {
  id: string;
  user_id: string;
  sleep_duration: number;
  break_duration: number;
  usage_duration: number;
  mental_health_score: number;
  date: string;
}

export interface HealthData {
  id: string;
  user_id: string;
  hydration_level: number;
  calories_consumed: number;
  movement_minutes: number;
  workout_completed: boolean;
  stress_level: number;
  date: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Network error');
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signup(userData: SignupRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse<null>> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Task endpoints
  async getTasks(): Promise<ApiResponse<Task[]>> {
    return this.request('/tasks');
  }

  async createTask(task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Task>> {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<ApiResponse<Task>> {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(id: string): Promise<ApiResponse<null>> {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Goal endpoints
  async getGoals(): Promise<ApiResponse<Goal[]>> {
    return this.request('/goals');
  }

  async createGoal(goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Goal>> {
    return this.request('/goals', {
      method: 'POST',
      body: JSON.stringify(goal),
    });
  }

  async updateGoal(id: string, updates: Partial<Goal>): Promise<ApiResponse<Goal>> {
    return this.request(`/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteGoal(id: string): Promise<ApiResponse<null>> {
    return this.request(`/goals/${id}`, {
      method: 'DELETE',
    });
  }

  // Scrapbook endpoints
  async getScrapbookEntries(goalId: string): Promise<ApiResponse<ScrapbookEntry[]>> {
    return this.request(`/goals/${goalId}/scrapbook`);
  }

  async createScrapbookEntry(goalId: string, entry: Omit<ScrapbookEntry, 'id' | 'goal_id' | 'created_at'>): Promise<ApiResponse<ScrapbookEntry>> {
    return this.request(`/goals/${goalId}/scrapbook`, {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  }

  // User score endpoints
  async getUserScore(): Promise<ApiResponse<UserScore>> {
    return this.request('/user/score');
  }

  // Wellness endpoints
  async getWellnessData(date?: string): Promise<ApiResponse<WellnessData[]>> {
    const query = date ? `?date=${date}` : '';
    return this.request(`/wellness${query}`);
  }

  async updateWellnessData(data: Omit<WellnessData, 'id' | 'user_id'>): Promise<ApiResponse<WellnessData>> {
    return this.request('/wellness', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Health endpoints
  async getHealthData(date?: string): Promise<ApiResponse<HealthData[]>> {
    const query = date ? `?date=${date}` : '';
    return this.request(`/health${query}`);
  }

  async updateHealthData(data: Omit<HealthData, 'id' | 'user_id'>): Promise<ApiResponse<HealthData>> {
    return this.request('/health', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // AI Chat endpoints
  async sendChatMessage(message: string, context?: any): Promise<ApiResponse<{ response: string }>> {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
  }

  // Analytics endpoints
  async getUserAnalytics(): Promise<ApiResponse<any>> {
    return this.request('/analytics/user');
  }

  async getTaskAnalytics(): Promise<ApiResponse<any>> {
    return this.request('/analytics/tasks');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);