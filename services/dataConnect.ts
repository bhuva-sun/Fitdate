// Firebase Data Connect Service Layer
import { ConnectorConfig } from '@firebasegen/default-connector';

// Initialize the Data Connect connector
// This will be available after you run: firebase deploy --only dataconnect
export const dataConnect = new ConnectorConfig({
  location: 'us-central1',
  connector: 'fitdate',
  service: 'fitdate'
});

// User Profile Services
export const userProfileService = {
  async getUserProfile() {
    try {
      const result = await dataConnect.getUserProfile.execute();
      return result.data.user;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  async updateUserProfile(profileData: {
    email: string;
    displayName?: string;
    profileImageUrl?: string;
    dateOfBirth?: string;
    height?: number;
    weight?: number;
    activityLevel?: string;
    fitnessGoals?: string[];
    dailyCalorieGoal?: number;
    dailyStepsGoal?: number;
    weeklyWorkoutGoal?: number;
  }) {
    try {
      const result = await dataConnect.upsertUserProfile.execute(profileData);
      return result.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
};

// Exercise Services
export const exerciseService = {
  async getExercises(filters?: {
    category?: string;
    difficulty?: string;
    equipment?: string;
  }) {
    try {
      const result = await dataConnect.listExercises.execute(filters || {});
      return result.data.exercises;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw error;
    }
  },

  async getExerciseById(id: string) {
    try {
      const result = await dataConnect.getExerciseById.execute({ id });
      return result.data.exercise;
    } catch (error) {
      console.error('Error fetching exercise:', error);
      throw error;
    }
  }
};

// Workout Services
export const workoutService = {
  async getWorkoutPlans(filters?: {
    category?: string;
    difficulty?: string;
  }) {
    try {
      const result = await dataConnect.listWorkoutPlans.execute(filters || {});
      return result.data.workoutPlans;
    } catch (error) {
      console.error('Error fetching workout plans:', error);
      throw error;
    }
  },

  async getWorkoutPlanById(id: string) {
    try {
      const result = await dataConnect.getWorkoutPlanById.execute({ id });
      return result.data.workoutPlan;
    } catch (error) {
      console.error('Error fetching workout plan:', error);
      throw error;
    }
  },

  async startWorkoutSession(data: {
    workoutPlanId?: string;
    title: string;
  }) {
    try {
      const result = await dataConnect.startWorkoutSession.execute(data);
      return result.data;
    } catch (error) {
      console.error('Error starting workout session:', error);
      throw error;
    }
  },

  async completeWorkoutSession(data: {
    sessionId: string;
    totalCaloriesBurned?: number;
    notes?: string;
  }) {
    try {
      const result = await dataConnect.completeWorkoutSession.execute(data);
      return result.data;
    } catch (error) {
      console.error('Error completing workout session:', error);
      throw error;
    }
  },

  async getUserWorkoutSessions(dateRange?: {
    startDate?: string;
    endDate?: string;
  }) {
    try {
      const result = await dataConnect.listUserWorkoutSessions.execute(dateRange || {});
      return result.data.user?.workoutSessions || [];
    } catch (error) {
      console.error('Error fetching workout sessions:', error);
      throw error;
    }
  }
};

// Nutrition Services
export const nutritionService = {
  async searchFoods(query: {
    searchQuery?: string;
    barcode?: string;
  }) {
    try {
      const result = await dataConnect.searchFoods.execute(query);
      return result.data.foods;
    } catch (error) {
      console.error('Error searching foods:', error);
      throw error;
    }
  },

  async getUserMealsForDate(date: string) {
    try {
      const result = await dataConnect.getUserMealsForDate.execute({ date });
      return result.data.user?.meals || [];
    } catch (error) {
      console.error('Error fetching meals:', error);
      throw error;
    }
  },

  async addFoodToMeal(data: {
    mealId: string;
    foodId: string;
    quantity: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }) {
    try {
      const result = await dataConnect.addFoodToMeal.execute(data);
      return result.data;
    } catch (error) {
      console.error('Error adding food to meal:', error);
      throw error;
    }
  },

  async createMeal(data: {
    name: string;
    date: string;
  }) {
    try {
      const result = await dataConnect.upsertMeal.execute(data);
      return result.data;
    } catch (error) {
      console.error('Error creating meal:', error);
      throw error;
    }
  }
};

// Activity Services
export const activityService = {
  async getDailyActivity(dateRange: {
    startDate: string;
    endDate: string;
  }) {
    try {
      const result = await dataConnect.getUserDailyActivity.execute(dateRange);
      return result.data.user?.dailyActivities || [];
    } catch (error) {
      console.error('Error fetching daily activity:', error);
      throw error;
    }
  },

  async getTodayActivity() {
    try {
      const result = await dataConnect.getTodayActivity.execute();
      return {
        goals: {
          dailyStepsGoal: result.data.user?.dailyStepsGoal,
          dailyCalorieGoal: result.data.user?.dailyCalorieGoal
        },
        todayActivity: result.data.user?.todayActivity?.[0]
      };
    } catch (error) {
      console.error('Error fetching today activity:', error);
      throw error;
    }
  },

  async updateDailyActivity(data: {
    date: string;
    steps?: number;
    activeMinutes?: number;
    caloriesBurned?: number;
    sleepHours?: number;
    waterIntake?: number;
    restingHeartRate?: number;
    weight?: number;
  }) {
    try {
      const result = await dataConnect.upsertDailyActivity.execute(data);
      return result.data;
    } catch (error) {
      console.error('Error updating daily activity:', error);
      throw error;
    }
  }
};

// Achievement Services
export const achievementService = {
  async getUserAchievements() {
    try {
      const result = await dataConnect.getUserAchievements.execute();
      return result.data.user?.achievements || [];
    } catch (error) {
      console.error('Error fetching achievements:', error);
      throw error;
    }
  },

  async updateAchievementProgress(data: {
    achievementId: string;
    currentProgress: number;
  }) {
    try {
      const result = await dataConnect.updateAchievementProgress.execute(data);
      return result.data;
    } catch (error) {
      console.error('Error updating achievement:', error);
      throw error;
    }
  },

  async completeAchievement(data: {
    achievementId: string;
    currentProgress: number;
  }) {
    try {
      const result = await dataConnect.completeAchievement.execute(data);
      return result.data;
    } catch (error) {
      console.error('Error completing achievement:', error);
      throw error;
    }
  }
};

// Export all services
export default {
  userProfile: userProfileService,
  exercise: exerciseService,
  workout: workoutService,
  nutrition: nutritionService,
  activity: activityService,
  achievement: achievementService
};