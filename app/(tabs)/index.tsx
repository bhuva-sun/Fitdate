import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';

import { Text, View } from '@/components/Themed';

// Mock data for dashboard
const dashboardData = {
  todaySummary: {
    steps: 8423,
    stepsGoal: 10000,
    calories: 1845,
    caloriesGoal: 2500,
    activeMinutes: 42,
    activeMinutesGoal: 60,
    water: 5,
    waterGoal: 8,
  },
  weeklyProgress: {
    workoutsCompleted: 3,
    workoutsGoal: 5,
    caloriesBurned: 3240,
    averageSteps: 9120,
  },
  upcomingWorkout: {
    name: 'HIIT Cardio',
    time: '5:00 PM Today',
    duration: '30 min',
    difficulty: 'Intermediate',
  },
  nutrition: {
    calories: {
      consumed: 1560,
      goal: 2000,
      remaining: 440,
    },
    macros: {
      protein: 95,
      proteinGoal: 120,
      carbs: 180,
      carbsGoal: 250,
      fat: 48,
      fatGoal: 65,
    },
  },
  recentWorkouts: [
    {
      id: '1',
      name: 'Morning Run',
      date: '2025-04-14',
      duration: 32,
      calories: 420,
    },
    {
      id: '2',
      name: 'Weight Training',
      date: '2025-04-13',
      duration: 45,
      calories: 310,
    },
  ],
  achievements: [
    {
      id: '1',
      title: 'Early Bird',
      description: 'Complete 5 workouts before 8 AM',
      progress: 3,
      total: 5,
      icon: 'sun-o',
    },
    {
      id: '2',
      title: 'Step Master',
      description: 'Reach 10,000 steps for 7 consecutive days',
      progress: 4,
      total: 7,
      icon: 'street-view',
    },
  ],
};

// Progress bar component
function ProgressBar({ progress, color = '#4CAF50', height = 8 }: { progress: number, color?: string, height?: number }) {
  const progressValue = Math.min(Math.max(progress, 0), 1);
  
  return (
    <View style={[styles.progressBarContainer, { height }]}>
      <View 
        style={[
          styles.progressBar, 
          { 
            width: `${progressValue * 100}%`,
            backgroundColor: color
          }
        ]} 
      />
    </View>
  );
}

export default function DashboardScreen() {
  // Calculate progress percentages
  const stepsProgress = dashboardData.todaySummary.steps / dashboardData.todaySummary.stepsGoal;
  const caloriesProgress = dashboardData.todaySummary.calories / dashboardData.todaySummary.caloriesGoal;
  const activeMinutesProgress = dashboardData.todaySummary.activeMinutes / dashboardData.todaySummary.activeMinutesGoal;
  const waterProgress = dashboardData.todaySummary.water / dashboardData.todaySummary.waterGoal;
  const workoutsProgress = dashboardData.weeklyProgress.workoutsCompleted / dashboardData.weeklyProgress.workoutsGoal;
  
  // Calculate nutrition progress
  const caloriesConsumedProgress = dashboardData.nutrition.calories.consumed / dashboardData.nutrition.calories.goal;
  const proteinProgress = dashboardData.nutrition.macros.protein / dashboardData.nutrition.macros.proteinGoal;
  const carbsProgress = dashboardData.nutrition.macros.carbs / dashboardData.nutrition.macros.carbsGoal;
  const fatProgress = dashboardData.nutrition.macros.fat / dashboardData.nutrition.macros.fatGoal;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
      </View>
      <Link href="/(tabs)/profile" asChild>
          <TouchableOpacity style={styles.profileButton}>
            <FontAwesome name="user-circle" size={36} color="#333" />
          </TouchableOpacity>
        </Link>
      </View>
      
      {/* Today's Summary */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today's Summary</Text>
      <Link href={"/(tabs)/activity" as any} asChild>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>Details</Text>
          </TouchableOpacity>
        </Link>
      </View>
      
      <View style={styles.summaryGrid}>
        <View style={styles.summaryItem}>
          <View style={styles.summaryItemHeader}>
          <FontAwesome name="location-arrow" size={18} color="#2196F3" />
            <Text style={styles.summaryItemTitle}>Steps</Text>
          </View>
          <Text style={styles.summaryItemValue}>{dashboardData.todaySummary.steps.toLocaleString()}</Text>
          <Text style={styles.summaryItemGoal}>Goal: {dashboardData.todaySummary.stepsGoal.toLocaleString()}</Text>
          <ProgressBar progress={stepsProgress} color="#2196F3" />
        </View>
        
        <View style={styles.summaryItem}>
          <View style={styles.summaryItemHeader}>
            <FontAwesome name="fire" size={18} color="#F44336" />
            <Text style={styles.summaryItemTitle}>Calories</Text>
          </View>
          <Text style={styles.summaryItemValue}>{dashboardData.todaySummary.calories.toLocaleString()}</Text>
          <Text style={styles.summaryItemGoal}>Goal: {dashboardData.todaySummary.caloriesGoal.toLocaleString()}</Text>
          <ProgressBar progress={caloriesProgress} color="#F44336" />
        </View>
        
        <View style={styles.summaryItem}>
          <View style={styles.summaryItemHeader}>
            <FontAwesome name="bolt" size={18} color="#FF9800" />
            <Text style={styles.summaryItemTitle}>Active</Text>
          </View>
          <Text style={styles.summaryItemValue}>{dashboardData.todaySummary.activeMinutes} min</Text>
          <Text style={styles.summaryItemGoal}>Goal: {dashboardData.todaySummary.activeMinutesGoal} min</Text>
          <ProgressBar progress={activeMinutesProgress} color="#FF9800" />
        </View>
        
        <View style={styles.summaryItem}>
          <View style={styles.summaryItemHeader}>
            <FontAwesome name="tint" size={18} color="#03A9F4" />
            <Text style={styles.summaryItemTitle}>Water</Text>
          </View>
          <Text style={styles.summaryItemValue}>{dashboardData.todaySummary.water} cups</Text>
          <Text style={styles.summaryItemGoal}>Goal: {dashboardData.todaySummary.waterGoal} cups</Text>
          <ProgressBar progress={waterProgress} color="#03A9F4" />
        </View>
      </View>
      
      {/* Weekly Progress */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Weekly Progress</Text>
      </View>
      
      <View style={styles.card}>
        <View style={styles.weeklyProgressRow}>
          <View style={styles.weeklyProgressItem}>
            <Text style={styles.weeklyProgressLabel}>Workouts</Text>
            <View style={styles.weeklyProgressValue}>
              <Text style={styles.progressBold}>
                {dashboardData.weeklyProgress.workoutsCompleted}
              </Text>
              <Text style={styles.progressNormal}>
                /{dashboardData.weeklyProgress.workoutsGoal}
              </Text>
            </View>
            <ProgressBar progress={workoutsProgress} color="#4CAF50" />
          </View>
          
          <View style={styles.weeklyProgressItem}>
            <Text style={styles.weeklyProgressLabel}>Calories Burned</Text>
            <Text style={styles.weeklyProgressValue}>
              {dashboardData.weeklyProgress.caloriesBurned.toLocaleString()}
            </Text>
          </View>
        </View>
        
        <View style={styles.weeklyProgressRow}>
          <View style={styles.weeklyProgressItem}>
            <Text style={styles.weeklyProgressLabel}>Avg. Daily Steps</Text>
            <Text style={styles.weeklyProgressValue}>
              {dashboardData.weeklyProgress.averageSteps.toLocaleString()}
            </Text>
          </View>
          
          <Link href={"/(tabs)/workouts" as any} asChild>
            <TouchableOpacity style={styles.weeklyProgressItem}>
              <View style={styles.viewWorkoutsButton}>
                <Text style={styles.viewWorkoutsText}>View Workouts</Text>
              </View>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
      
      {/* Upcoming Workout */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Upcoming Workout</Text>
        <Link href={"/(tabs)/workouts" as any} asChild>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>All Workouts</Text>
          </TouchableOpacity>
        </Link>
      </View>
      
      <View style={styles.card}>
        <View style={styles.upcomingWorkout}>
          <View style={styles.upcomingWorkoutIcon}>
            <FontAwesome name="heartbeat" size={24} color="white" />
          </View>
          
          <View style={styles.upcomingWorkoutDetails}>
            <Text style={styles.upcomingWorkoutName}>{dashboardData.upcomingWorkout.name}</Text>
            <Text style={styles.upcomingWorkoutTime}>{dashboardData.upcomingWorkout.time}</Text>
            
            <View style={styles.upcomingWorkoutMeta}>
              <View style={styles.upcomingWorkoutMetaItem}>
                <FontAwesome name="clock-o" size={14} color="#666" />
                <Text style={styles.upcomingWorkoutMetaText}>
                  {dashboardData.upcomingWorkout.duration}
                </Text>
              </View>
              <View style={styles.upcomingWorkoutMetaItem}>
                <FontAwesome name="signal" size={14} color="#666" />
                <Text style={styles.upcomingWorkoutMetaText}>
                  {dashboardData.upcomingWorkout.difficulty}
                </Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity style={styles.startWorkoutButton}>
            <Text style={styles.startWorkoutText}>Start</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Nutrition Summary */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Nutrition Summary</Text>
        <Link href={"/(tabs)/nutrition" as any} asChild>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>Details</Text>
          </TouchableOpacity>
        </Link>
      </View>
      
      <View style={styles.card}>
        <View style={styles.nutritionHeader}>
          <View>
            <Text style={styles.nutritionTitle}>Calories Consumed</Text>
            <View style={styles.calorieStats}>
              <Text style={styles.caloriesConsumed}>
                {dashboardData.nutrition.calories.consumed}
              </Text>
              <Text style={styles.caloriesGoal}>
                /{dashboardData.nutrition.calories.goal}
              </Text>
            </View>
          </View>
          
          <View style={styles.caloriesRemaining}>
            <Text style={styles.caloriesRemainingValue}>
              {dashboardData.nutrition.calories.remaining}
            </Text>
            <Text style={styles.caloriesRemainingLabel}>remaining</Text>
          </View>
        </View>
        
        <ProgressBar progress={caloriesConsumedProgress} color="#4CAF50" height={10} />
        
        <View style={styles.macrosContainer}>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Protein</Text>
            <Text style={styles.macroValue}>
              {dashboardData.nutrition.macros.protein}g/
              {dashboardData.nutrition.macros.proteinGoal}g
            </Text>
            <ProgressBar progress={proteinProgress} color="#F44336" />
          </View>
          
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Carbs</Text>
            <Text style={styles.macroValue}>
              {dashboardData.nutrition.macros.carbs}g/
              {dashboardData.nutrition.macros.carbsGoal}g
            </Text>
            <ProgressBar progress={carbsProgress} color="#2196F3" />
          </View>
          
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Fat</Text>
            <Text style={styles.macroValue}>
              {dashboardData.nutrition.macros.fat}g/
              {dashboardData.nutrition.macros.fatGoal}g
            </Text>
            <ProgressBar progress={fatProgress} color="#FF9800" />
          </View>
        </View>
        
        <Link href={"/(tabs)/nutrition" as any} asChild>
          <TouchableOpacity style={styles.addFoodButton}>
            <FontAwesome name="plus" size={14} color="white" />
            <Text style={styles.addFoodText}>Add Food</Text>
          </TouchableOpacity>
        </Link>
      </View>
      
      {/* Recent Workouts */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Workouts</Text>
        <Link href={"/(tabs)/activity" as any} asChild>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>All Activity</Text>
          </TouchableOpacity>
        </Link>
      </View>
      
      <View style={styles.card}>
        {dashboardData.recentWorkouts.map((workout, index) => (
          <View 
            key={workout.id} 
            style={[
              styles.recentWorkout,
              index < dashboardData.recentWorkouts.length - 1 && styles.workoutDivider
            ]}
          >
            <View style={styles.recentWorkoutIcon}>
              <FontAwesome name="bolt" size={20} color="white" />
            </View>
            
            <View style={styles.recentWorkoutDetails}>
              <Text style={styles.recentWorkoutName}>{workout.name}</Text>
              <Text style={styles.recentWorkoutDate}>
                {new Date(workout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Text>
            </View>
            
            <View style={styles.recentWorkoutStats}>
              <View style={styles.recentWorkoutStat}>
                <FontAwesome name="clock-o" size={14} color="#666" />
                <Text style={styles.recentWorkoutStatText}>
                  {workout.duration} min
                </Text>
              </View>
              <View style={styles.recentWorkoutStat}>
                <FontAwesome name="fire" size={14} color="#666" />
                <Text style={styles.recentWorkoutStatText}>
                  {workout.calories} cal
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
      
      {/* Achievements */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <TouchableOpacity>
          <Text style={styles.sectionLink}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.card}>
        {dashboardData.achievements.map((achievement, index) => (
          <View 
            key={achievement.id} 
            style={[
              styles.achievement,
              index < dashboardData.achievements.length - 1 && styles.achievementDivider
            ]}
          >
            <View style={styles.achievementIcon}>
              <FontAwesome name={achievement.icon as any} size={20} color="white" />
            </View>
            
            <View style={styles.achievementDetails}>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDescription}>
                {achievement.description}
              </Text>
              <View style={styles.achievementProgressContainer}>
                <View style={styles.achievementProgressTextContainer}>
                  <Text style={styles.achievementProgressText}>
                    {achievement.progress}/{achievement.total}
                  </Text>
                </View>
                <ProgressBar 
                  progress={achievement.progress / achievement.total} 
                  color="#9C27B0" 
                />
              </View>
            </View>
          </View>
        ))}
      </View>
      
      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  profileButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionLink: {
    fontSize: 14,
    color: '#2196F3',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  summaryItem: {
    width: '50%',
    padding: 8,
  },
  summaryItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryItemTitle: {
    fontSize: 16,
    marginLeft: 8,
    color: '#333333',
    fontWeight: '600',
  },
  summaryItemValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#FF4B4B',
  },
  summaryItemGoal: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  progressBarContainer: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  weeklyProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  weeklyProgressItem: {
    width: '48%',
  },
  weeklyProgressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  weeklyProgressValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  progressBold: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressNormal: {
    fontSize: 16,
    color: '#666',
  },
  viewWorkoutsButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  viewWorkoutsText: {
    color: 'white',
    fontWeight: 'bold',
  },
  upcomingWorkout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upcomingWorkoutIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF5722',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  upcomingWorkoutDetails: {
    flex: 1,
  },
  upcomingWorkoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  upcomingWorkoutTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  upcomingWorkoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upcomingWorkoutMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  upcomingWorkoutMetaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  startWorkoutButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  startWorkoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
  nutritionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  nutritionTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  calorieStats: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  caloriesConsumed: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  caloriesGoal: {
    fontSize: 16,
    color: '#666',
  },
  caloriesRemaining: {
    alignItems: 'flex-end',
  },
  caloriesRemainingValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  caloriesRemainingLabel: {
    fontSize: 12,
    color: '#666',
  },
  macrosContainer: {
    marginTop: 15,
  },
  macroItem: {
    marginBottom: 10,
  },
  macroLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  macroValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  addFoodButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    paddingVertical: 10,
    marginTop: 10,
  },
  addFoodText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  recentWorkout: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  workoutDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recentWorkoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF9800',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  recentWorkoutDetails: {
    flex: 1,
  },
  recentWorkoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  recentWorkoutDate: {
    fontSize: 14,
    color: '#666',
  },
  recentWorkoutStats: {
    alignItems: 'flex-end',
  },
  recentWorkoutStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  recentWorkoutStatText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  achievementDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9C27B0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  achievementDetails: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  achievementProgressContainer: {
    width: '100%',
  },
  achievementProgressTextContainer: {
    alignItems: 'flex-end',
    marginBottom: 5,
  },
  achievementProgressText: {
    fontSize: 12,
    color: '#666',
  },
  bottomSpacing: {
    height: 20,
  },
});