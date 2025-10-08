import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import dataConnectService from '@/services/dataConnect';

// Hook for user profile management
export function useUserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const fetchProfile = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userProfile = await dataConnectService.userProfile.getUserProfile();
      setProfile(userProfile);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const updateProfile = useCallback(async (profileData: any) => {
    try {
      setLoading(true);
      setError(null);
      await dataConnectService.userProfile.updateUserProfile(profileData);
      await fetchProfile(); // Refresh profile data
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile
  };
}

// Hook for workout plans
export function useWorkoutPlans(filters?: { category?: string; difficulty?: string }) {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkoutPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const plans = await dataConnectService.workout.getWorkoutPlans(filters);
      setWorkoutPlans(plans);
    } catch (err: any) {
      console.error('Error fetching workout plans:', err);
      setError(err.message || 'Failed to fetch workout plans');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchWorkoutPlans();
  }, [fetchWorkoutPlans]);

  return {
    workoutPlans,
    loading,
    error,
    refetch: fetchWorkoutPlans
  };
}

// Hook for exercises
export function useExercises(filters?: { category?: string; difficulty?: string; equipment?: string }) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const exerciseList = await dataConnectService.exercise.getExercises(filters);
      setExercises(exerciseList);
    } catch (err: any) {
      console.error('Error fetching exercises:', err);
      setError(err.message || 'Failed to fetch exercises');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  return {
    exercises,
    loading,
    error,
    refetch: fetchExercises
  };
}

// Hook for workout sessions
export function useWorkoutSessions(dateRange?: { startDate?: string; endDate?: string }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const sessionList = await dataConnectService.workout.getUserWorkoutSessions(dateRange);
      setSessions(sessionList);
    } catch (err: any) {
      console.error('Error fetching workout sessions:', err);
      setError(err.message || 'Failed to fetch workout sessions');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  const startSession = useCallback(async (data: { workoutPlanId?: string; title: string }) => {
    try {
      const newSession = await dataConnectService.workout.startWorkoutSession(data);
      await fetchSessions(); // Refresh sessions list
      return newSession;
    } catch (err: any) {
      console.error('Error starting workout session:', err);
      throw err;
    }
  }, [fetchSessions]);

  const completeSession = useCallback(async (data: {
    sessionId: string;
    totalCaloriesBurned?: number;
    notes?: string;
  }) => {
    try {
      await dataConnectService.workout.completeWorkoutSession(data);
      await fetchSessions(); // Refresh sessions list
    } catch (err: any) {
      console.error('Error completing workout session:', err);
      throw err;
    }
  }, [fetchSessions]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    loading,
    error,
    startSession,
    completeSession,
    refetch: fetchSessions
  };
}

// Hook for nutrition/meals
export function useMeals(date: string) {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const mealList = await dataConnectService.nutrition.getUserMealsForDate(date);
      setMeals(mealList);
    } catch (err: any) {
      console.error('Error fetching meals:', err);
      setError(err.message || 'Failed to fetch meals');
    } finally {
      setLoading(false);
    }
  }, [date]);

  const createMeal = useCallback(async (mealData: { name: string; date: string }) => {
    try {
      const newMeal = await dataConnectService.nutrition.createMeal(mealData);
      await fetchMeals(); // Refresh meals list
      return newMeal;
    } catch (err: any) {
      console.error('Error creating meal:', err);
      throw err;
    }
  }, [fetchMeals]);

  const addFoodToMeal = useCallback(async (data: {
    mealId: string;
    foodId: string;
    quantity: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }) => {
    try {
      await dataConnectService.nutrition.addFoodToMeal(data);
      await fetchMeals(); // Refresh meals list
    } catch (err: any) {
      console.error('Error adding food to meal:', err);
      throw err;
    }
  }, [fetchMeals]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  return {
    meals,
    loading,
    error,
    createMeal,
    addFoodToMeal,
    refetch: fetchMeals
  };
}

// Hook for food search
export function useFoodSearch() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchFoods = useCallback(async (query: { searchQuery?: string; barcode?: string }) => {
    try {
      setLoading(true);
      setError(null);
      const foodList = await dataConnectService.nutrition.searchFoods(query);
      setFoods(foodList);
      return foodList;
    } catch (err: any) {
      console.error('Error searching foods:', err);
      setError(err.message || 'Failed to search foods');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    foods,
    loading,
    error,
    searchFoods
  };
}

// Hook for daily activity
export function useDailyActivity(dateRange?: { startDate: string; endDate: string }) {
  const [activities, setActivities] = useState([]);
  const [todayActivity, setTodayActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (dateRange) {
        const activityList = await dataConnectService.activity.getDailyActivity(dateRange);
        setActivities(activityList);
      }
      
      // Also fetch today's activity
      const todayData = await dataConnectService.activity.getTodayActivity();
      setTodayActivity(todayData);
    } catch (err: any) {
      console.error('Error fetching activities:', err);
      setError(err.message || 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  const updateActivity = useCallback(async (data: {
    date: string;
    steps?: number;
    activeMinutes?: number;
    caloriesBurned?: number;
    sleepHours?: number;
    waterIntake?: number;
    restingHeartRate?: number;
    weight?: number;
  }) => {
    try {
      await dataConnectService.activity.updateDailyActivity(data);
      await fetchActivities(); // Refresh activity data
    } catch (err: any) {
      console.error('Error updating activity:', err);
      throw err;
    }
  }, [fetchActivities]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    todayActivity,
    loading,
    error,
    updateActivity,
    refetch: fetchActivities
  };
}

// Hook for achievements
export function useAchievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const achievementList = await dataConnectService.achievement.getUserAchievements();
      setAchievements(achievementList);
    } catch (err: any) {
      console.error('Error fetching achievements:', err);
      setError(err.message || 'Failed to fetch achievements');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProgress = useCallback(async (data: {
    achievementId: string;
    currentProgress: number;
  }) => {
    try {
      await dataConnectService.achievement.updateAchievementProgress(data);
      await fetchAchievements(); // Refresh achievements
    } catch (err: any) {
      console.error('Error updating achievement progress:', err);
      throw err;
    }
  }, [fetchAchievements]);

  const completeAchievement = useCallback(async (data: {
    achievementId: string;
    currentProgress: number;
  }) => {
    try {
      await dataConnectService.achievement.completeAchievement(data);
      await fetchAchievements(); // Refresh achievements
    } catch (err: any) {
      console.error('Error completing achievement:', err);
      throw err;
    }
  }, [fetchAchievements]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  return {
    achievements,
    loading,
    error,
    updateProgress,
    completeAchievement,
    refetch: fetchAchievements
  };
}