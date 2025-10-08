import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Text, View } from '@/components/Themed';

// Helper function to generate random data points for charts
const generateRandomData = (count: number, min: number, max: number): number[] => {
  return Array.from({ length: count }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  );
};

// Sample activity data
const activityData = {
  steps: {
    today: 8423,
    goal: 10000,
    weekHistory: generateRandomData(7, 5000, 12000)
  },
  heartRate: {
    current: 72,
    min: 58,
    max: 142,
    avg: 74,
    history: generateRandomData(24, 60, 90)
  },
  sleep: {
    lastNight: {
      duration: 7.5,
      deep: 2.3,
      light: 4.1,
      rem: 1.1
    },
    weekAvg: 7.2,
    weekHistory: generateRandomData(7, 5, 9).map(h => h + Math.round(Math.random() * 10) / 10)
  },
  calories: {
    burned: 1845,
    goal: 2500,
    weekHistory: generateRandomData(7, 1500, 3000)
  },
  workouts: [
    {
      id: '1',
      type: 'Running',
      date: '2025-04-14',
      time: '07:30 AM',
      duration: 32,
      distance: 4.2,
      calories: 420,
      avgHeartRate: 158
    },
    {
      id: '2',
      type: 'Weight Training',
      date: '2025-04-13',
      time: '06:15 PM',
      duration: 45,
      calories: 310,
      avgHeartRate: 132
    },
    {
      id: '3',
      type: 'Cycling',
      date: '2025-04-12',
      time: '08:45 AM',
      duration: 60,
      distance: 15.3,
      calories: 540,
      avgHeartRate: 145
    }
  ]
};

// Simple bar chart component
function BarChart({ 
  data, 
  height = 120, 
  barColor = '#4CAF50',
  labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] 
}: { 
  data: number[], 
  height?: number, 
  barColor?: string,
  labels?: string[] 
}) {
  const maxValue = Math.max(...data);
  
  return (
    <View style={[styles.chartContainer, { height }]}>
      {data.map((value, index) => (
        <View key={index} style={styles.barContainer}>
          <View 
            style={[
              styles.bar, 
              { 
                height: `${(value / maxValue) * 100}%`,
                backgroundColor: barColor
              }
            ]} 
          />
          <Text style={styles.barLabel}>{labels[index]}</Text>
        </View>
      ))}
    </View>
  );
}

// Heart rate line chart (simplified visualization)
function HeartRateChart({ data, height = 100 }: { data: number[], height?: number }) {
  const screenWidth = Dimensions.get('window').width - 40; // Account for padding
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue;
  
  // Convert data points to line segments
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * screenWidth;
    const y = height - ((value - minValue) / range) * height;
    return { x, y };
  });
  
  return (
    <View style={[styles.lineChartContainer, { height }]}>
      {/* Simplified line representation */}
      <View style={styles.lineChart}>
        {points.map((point, index) => (
          index < points.length - 1 && (
            <View 
              key={index}
              style={[
                styles.lineSegment,
                {
                  left: point.x,
                  top: point.y,
                  width: points[index + 1].x - point.x,
                  height: 2,
                  transform: [{ 
                    rotate: `${Math.atan2(points[index + 1].y - point.y, points[index + 1].x - point.x) * (180 / Math.PI)}deg` 
                  }],
                  transformOrigin: 'left center'
                }
              ]}
            />
          )
        ))}
        {points.map((point, index) => (
          <View 
            key={`point-${index}`}
            style={[
              styles.dataPoint,
              {
                left: point.x - 3,
                top: point.y - 3,
              }
            ]}
          />
        ))}
      </View>
      
      {/* Time labels */}
      <View style={styles.timeLabels}>
        <Text style={styles.timeLabel}>12AM</Text>
        <Text style={styles.timeLabel}>6AM</Text>
        <Text style={styles.timeLabel}>12PM</Text>
        <Text style={styles.timeLabel}>6PM</Text>
        <Text style={styles.timeLabel}>12AM</Text>
      </View>
    </View>
  );
}

// Sleep chart component
function SleepChart({ data, height = 120 }: { data: { deep: number, light: number, rem: number }, height?: number }) {
  const total = data.deep + data.light + data.rem;
  const deepPercent = (data.deep / total) * 100;
  const lightPercent = (data.light / total) * 100;
  const remPercent = (data.rem / total) * 100;
  
  return (
    <View style={[styles.sleepChartContainer, { height }]}>
      <View style={styles.sleepBarContainer}>
        <View style={styles.sleepSegmentsContainer}>
          <View style={[styles.sleepSegment, styles.deepSleepSegment, { flex: deepPercent }]} />
          <View style={[styles.sleepSegment, styles.lightSleepSegment, { flex: lightPercent }]} />
          <View style={[styles.sleepSegment, styles.remSleepSegment, { flex: remPercent }]} />
        </View>
        
        <View style={styles.sleepLegend}>
          <View style={styles.sleepLegendItem}>
            <View style={[styles.sleepLegendColor, styles.deepSleepSegment]} />
            <Text style={styles.sleepLegendText}>Deep ({data.deep}h)</Text>
          </View>
          <View style={styles.sleepLegendItem}>
            <View style={[styles.sleepLegendColor, styles.lightSleepSegment]} />
            <Text style={styles.sleepLegendText}>Light ({data.light}h)</Text>
          </View>
          <View style={styles.sleepLegendItem}>
            <View style={[styles.sleepLegendColor, styles.remSleepSegment]} />
            <Text style={styles.sleepLegendText}>REM ({data.rem}h)</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// Circular progress component
function CircularProgress({ 
  progress, 
  size = 120, 
  strokeWidth = 12, 
  color = '#4CAF50' 
}: { 
  progress: number, 
  size?: number, 
  strokeWidth?: number, 
  color?: string 
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressValue = Math.min(Math.max(progress, 0), 1);
  const strokeDashoffset = circumference - progressValue * circumference;

  return (
    <View style={[styles.circularProgressContainer, { width: size, height: size }]}>
      {/* Background circle */}
      <View style={[
        styles.circularProgressBackground,
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          borderWidth: strokeWidth,
        }
      ]} />

      {/* Progress arc (simplified representation) */}
      <View style={[
        styles.circularProgressArc,
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: color,
          // Simplified: Just show part of the border based on progress
          borderLeftColor: progressValue < 0.25 ? 'transparent' : color,
          borderBottomColor: progressValue < 0.5 ? 'transparent' : color,
          borderRightColor: progressValue < 0.75 ? 'transparent' : color,
        }
      ]} />
    </View>
  );
}

export default function ActivityScreen() {
  const [selectedTab, setSelectedTab] = useState<'daily' | 'sleep' | 'heart' | 'workouts'>('daily');
  
  // Calculate step progress
  const stepProgress = activityData.steps.today / activityData.steps.goal;
  
  // Calculate calorie progress
  const calorieProgress = activityData.calories.burned / activityData.calories.goal;

  // Days of the week for charts
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Render different content based on selected tab
  const renderTabContent = () => {
    switch (selectedTab) {
      case 'daily':
        return (
          <>
            <View style={styles.activityCard}>
              <View style={styles.activityCardHeader}>
                <View>
                  <Text style={styles.activityTitle}>Steps</Text>
                  <Text style={styles.activityValue}>{activityData.steps.today.toLocaleString()}</Text>
                  <Text style={styles.activityGoal}>Goal: {activityData.steps.goal.toLocaleString()}</Text>
                </View>
                <CircularProgress progress={stepProgress} color="#2196F3" />
              </View>
              <Text style={styles.chartTitle}>Last 7 Days</Text>
              <BarChart data={activityData.steps.weekHistory} barColor="#2196F3" />
            </View>
            
            <View style={styles.activityCard}>
              <View style={styles.activityCardHeader}>
                <View>
                  <Text style={styles.activityTitle}>Calories Burned</Text>
                  <Text style={styles.activityValue}>{activityData.calories.burned.toLocaleString()}</Text>
                  <Text style={styles.activityGoal}>Goal: {activityData.calories.goal.toLocaleString()}</Text>
                </View>
                <CircularProgress progress={calorieProgress} color="#F44336" />
              </View>
              <Text style={styles.chartTitle}>Last 7 Days</Text>
              <BarChart data={activityData.calories.weekHistory} barColor="#F44336" />
            </View>
            
            <TouchableOpacity 
              style={styles.activityButton}
              onPress={() => setSelectedTab('sleep')}
            >
              <View style={styles.activityButtonContent}>
                <FontAwesome name="moon-o" size={24} color="#673AB7" />
                <View style={styles.activityButtonText}>
                  <Text style={styles.activityButtonTitle}>Sleep</Text>
                  <Text style={styles.activityButtonValue}>
                    {activityData.sleep.lastNight.duration} hours last night
                  </Text>
                </View>
              </View>
              <FontAwesome name="chevron-right" size={16} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.activityButton}
              onPress={() => setSelectedTab('heart')}
            >
              <View style={styles.activityButtonContent}>
                <FontAwesome name="heartbeat" size={24} color="#F44336" />
                <View style={styles.activityButtonText}>
                  <Text style={styles.activityButtonTitle}>Heart Rate</Text>
                  <Text style={styles.activityButtonValue}>
                    {activityData.heartRate.current} BPM current
                  </Text>
                </View>
              </View>
              <FontAwesome name="chevron-right" size={16} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.activityButton}
              onPress={() => setSelectedTab('workouts')}
            >
              <View style={styles.activityButtonContent}>
                <FontAwesome name="bolt" size={24} color="#FF9800" />
                <View style={styles.activityButtonText}>
                  <Text style={styles.activityButtonTitle}>Workouts</Text>
                  <Text style={styles.activityButtonValue}>
                    {activityData.workouts.length} this week
                  </Text>
                </View>
              </View>
              <FontAwesome name="chevron-right" size={16} color="#666" />
            </TouchableOpacity>
          </>
        );
        
      case 'sleep':
        return (
          <>
            <View style={styles.detailCard}>
              <View style={styles.detailCardHeader}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setSelectedTab('daily')}
                >
                  <FontAwesome name="arrow-left" size={18} color="#333" />
                  <Text style={styles.backText}>Activity</Text>
                </TouchableOpacity>
                <Text style={styles.detailTitle}>Sleep Analysis</Text>
              </View>
              
              <View style={styles.sleepSummary}>
                <View style={styles.sleepSummaryLeft}>
                  <Text style={styles.sleepDuration}>
                    {activityData.sleep.lastNight.duration}
                  </Text>
                  <Text style={styles.sleepDurationUnit}>hours</Text>
                </View>
                <View style={styles.sleepSummaryRight}>
                  <Text style={styles.sleepTime}>10:30 PM - 6:00 AM</Text>
                  <Text style={styles.sleepDate}>Last Night</Text>
                </View>
              </View>
              
              <SleepChart data={activityData.sleep.lastNight} />
              
              <Text style={styles.detailSubtitle}>Weekly Overview</Text>
              <View style={styles.sleepWeeklySummary}>
                <Text style={styles.sleepWeeklyAvg}>
                  {activityData.sleep.weekAvg} hrs
                </Text>
                <Text style={styles.sleepWeeklyAvgLabel}>Weekly Average</Text>
              </View>
              
              <BarChart 
                data={activityData.sleep.weekHistory} 
                barColor="#673AB7" 
              />
            </View>
          </>
        );
        
      case 'heart':
        return (
          <>
            <View style={styles.detailCard}>
              <View style={styles.detailCardHeader}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setSelectedTab('daily')}
                >
                  <FontAwesome name="arrow-left" size={18} color="#333" />
                  <Text style={styles.backText}>Activity</Text>
                </TouchableOpacity>
                <Text style={styles.detailTitle}>Heart Rate</Text>
              </View>
              
              <View style={styles.heartRateCurrent}>
                <View style={styles.heartRateIconContainer}>
                  <FontAwesome name="heartbeat" size={36} color="#F44336" />
                </View>
                <Text style={styles.heartRateValue}>
                  {activityData.heartRate.current}
                </Text>
                <Text style={styles.heartRateUnit}>BPM</Text>
              </View>
              
              <View style={styles.heartRateStats}>
                <View style={styles.heartRateStat}>
                  <Text style={styles.heartRateStatValue}>{activityData.heartRate.min}</Text>
                  <Text style={styles.heartRateStatLabel}>Min</Text>
                </View>
                <View style={styles.heartRateStat}>
                  <Text style={styles.heartRateStatValue}>{activityData.heartRate.avg}</Text>
                  <Text style={styles.heartRateStatLabel}>Avg</Text>
                </View>
                <View style={styles.heartRateStat}>
                  <Text style={styles.heartRateStatValue}>{activityData.heartRate.max}</Text>
                  <Text style={styles.heartRateStatLabel}>Max</Text>
                </View>
              </View>
              
              <Text style={styles.detailSubtitle}>Today's Heart Rate</Text>
              <HeartRateChart data={activityData.heartRate.history} />
              
              <View style={styles.heartRateZones}>
                <Text style={styles.heartRateZonesTitle}>Heart Rate Zones</Text>
                <View style={styles.heartRateZoneItem}>
                  <View style={[styles.heartRateZoneColor, { backgroundColor: '#CDDC39' }]} />
                  <Text style={styles.heartRateZoneText}>Resting (60-70 BPM)</Text>
                  <Text style={styles.heartRateZoneTime}>10h 23m</Text>
                </View>
                <View style={styles.heartRateZoneItem}>
                  <View style={[styles.heartRateZoneColor, { backgroundColor: '#8BC34A' }]} />
                  <Text style={styles.heartRateZoneText}>Light (71-90 BPM)</Text>
                  <Text style={styles.heartRateZoneTime}>12h 45m</Text>
                </View>
                <View style={styles.heartRateZoneItem}>
                  <View style={[styles.heartRateZoneColor, { backgroundColor: '#FF9800' }]} />
                  <Text style={styles.heartRateZoneText}>Moderate (91-120 BPM)</Text>
                  <Text style={styles.heartRateZoneTime}>0h 42m</Text>
                </View>
                <View style={styles.heartRateZoneItem}>
                  <View style={[styles.heartRateZoneColor, { backgroundColor: '#F44336' }]} />
                  <Text style={styles.heartRateZoneText}>Intense (120+ BPM)</Text>
                  <Text style={styles.heartRateZoneTime}>0h 10m</Text>
                </View>
              </View>
            </View>
          </>
        );
        
      case 'workouts':
        return (
          <>
            <View style={styles.detailCard}>
              <View style={styles.detailCardHeader}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setSelectedTab('daily')}
                >
                  <FontAwesome name="arrow-left" size={18} color="#333" />
                  <Text style={styles.backText}>Activity</Text>
                </TouchableOpacity>
                <Text style={styles.detailTitle}>Recent Workouts</Text>
              </View>
              
              {activityData.workouts.map(workout => (
                  <View key={workout.id} style={styles.workoutItem}>
                  <View style={styles.workoutIconContainer}>
                    <FontAwesome 
                      name={
                        workout.type === 'Running' ? 'bolt' : 
                        workout.type === 'Cycling' ? 'circle-o' : 'heartbeat'
                      } 
                      size={24} 
                      color="white" 
                    />
                  </View>
                  
                  <View style={styles.workoutDetails}>
                    <View style={styles.workoutHeader}>
                      <Text style={styles.workoutType}>{workout.type}</Text>
                      <Text style={styles.workoutDate}>
                        {workout.date} • {workout.time}
                      </Text>
                    </View>
                    
                    <View style={styles.workoutMetrics}>
                      <View style={styles.workoutMetric}>
                        <FontAwesome name="clock-o" size={16} color="#666" />
                        <Text style={styles.metricText}>{workout.duration} min</Text>
                      </View>
                      
                      {workout.distance && (
                        <View style={styles.workoutMetric}>
                          <FontAwesome name="map-marker" size={16} color="#666" />
                          <Text style={styles.metricText}>{workout.distance} km</Text>
                        </View>
                      )}
                      
                      <View style={styles.workoutMetric}>
                        <FontAwesome name="fire" size={16} color="#666" />
                        <Text style={styles.metricText}>{workout.calories} cal</Text>
                      </View>
                      
                      <View style={styles.workoutMetric}>
                        <FontAwesome name="heartbeat" size={16} color="#666" />
                        <Text style={styles.metricText}>{workout.avgHeartRate} bpm</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
              
              <TouchableOpacity style={styles.newWorkoutButton}>
                <Text style={styles.newWorkoutText}>Start New Workout</Text>
              </TouchableOpacity>
            </View>
          </>
        );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
        <Text style={styles.date}>Today, {new Date().toLocaleDateString()}</Text>
      </View>
      
      {renderTabContent()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: '#666666',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 5,
    marginVertical: 15,
    marginHorizontal: 15,
    borderRadius: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FF4B4B',
  },
  tabText: {
    fontSize: 14,
    color: '#666666',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
  },
  activityCard: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  activityCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  activityValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF4B4B',
    marginBottom: 5,
  },
  activityGoal: {
    fontSize: 14,
    color: '#666666',
  },
  chartTitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 15,
  },
  activityButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  activityButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityButtonText: {
    marginLeft: 15,
  },
  activityButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  activityButtonValue: {
    fontSize: 14,
    color: '#666666',
  },
  // Sleep specific styles
  sleepSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sleepSummaryLeft: {
    alignItems: 'center',
    marginRight: 20,
  },
  sleepDuration: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#673AB7',
  },
  sleepDurationUnit: {
    fontSize: 14,
    color: '#666666',
  },
  sleepSummaryRight: {
    flex: 1,
  },
  sleepTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  sleepDate: {
    fontSize: 14,
    color: '#666666',
  },
  sleepSegmentsContainer: {
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    flexDirection: 'row',
    marginBottom: 15,
  },
  sleepSegment: {
    height: '100%',
  },
  deepSleepSegment: {
    backgroundColor: '#673AB7',
  },
  lightSleepSegment: {
    backgroundColor: '#9575CD',
  },
  remSleepSegment: {
    backgroundColor: '#D1C4E9',
  },
  sleepLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  sleepLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sleepLegendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  sleepLegendText: {
    fontSize: 12,
    color: '#666666',
  },
  sleepChartContainer: {
    width: '100%',
  },
  sleepBarContainer: {
    flex: 1,
  },
  // Heart rate specific styles
  heartRateCurrent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  heartRateValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#F44336',
  },
  heartRateUnit: {
    fontSize: 16,
    color: '#666666',
    marginLeft: 5,
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  heartRateStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  heartRateStat: {
    alignItems: 'center',
  },
  heartRateStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  heartRateStatLabel: {
    fontSize: 14,
    color: '#666666',
  },
  heartRateZones: {
    marginTop: 20,
  },
  heartRateZonesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  heartRateZoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  heartRateZoneColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  heartRateZoneText: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
  },
  heartRateZoneTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666666',
  },
  heartRateIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  // Workouts specific styles
  workoutItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  workoutIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF9800',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  workoutDetails: {
    flex: 1,
  },
  workoutHeader: {
    marginBottom: 10,
  },
  workoutType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  workoutDate: {
    fontSize: 14,
    color: '#666666',
  },
  workoutMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  workoutMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 5,
  },
  metricText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 5,
  },
  newWorkoutButton: {
    backgroundColor: '#FF4B4B',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  newWorkoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Progress components
  circularProgressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularProgressBackground: {
    position: 'absolute',
    borderColor: '#f0f0f0',
  },
  circularProgressArc: {
    position: 'absolute',
  },
  chartContainer: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
  barChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '100%',
    paddingVertical: 10,
  },
  bar: {
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 4,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 5,
  },
  lineChartContainer: {
    width: '100%',
    marginBottom: 20,
  },
  lineChart: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  lineSegment: {
    position: 'absolute',
    backgroundColor: '#F44336',
    height: 2,
  },
  dataPoint: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F44336',
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeLabel: {
    fontSize: 12,
    color: '#666666',
  },
  detailCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  detailCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#333333',
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  detailSubtitle: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 15,
  },
  sleepWeeklySummary: {
    alignItems: 'center',
    marginVertical: 20,
  },
  sleepWeeklyAvg: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#673AB7',
  },
  sleepWeeklyAvgLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 5,
  },
});