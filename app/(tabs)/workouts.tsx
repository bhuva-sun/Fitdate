import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Modal, TextInput, ActivityIndicator } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Exercise, WorkoutPlan } from '@/types/workout';
import { exerciseDatabase, mockWorkoutPlans } from '@/constants/ExerciseData';

type ListItem = WorkoutPlan | Exercise;

export default function WorkoutsScreen() {
  const [workouts] = useState<WorkoutPlan[]>(mockWorkoutPlans);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutPlan | null>(null);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'plans' | 'exercises'>('plans');
  const [isLoading, setIsLoading] = useState(false);

  // Filter workout plans based on search and level
  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          workout.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel ? workout.level === filterLevel : true;
    
    return matchesSearch && matchesLevel;
  });

  // Filter exercises based on search and level
  const filteredExercises = exerciseDatabase.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (exercise.equipment?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
                         (exercise.targetMuscles?.some(muscle => 
                           muscle.toLowerCase().includes(searchQuery.toLowerCase())
                         ) || false);
    const matchesLevel = filterLevel ? exercise.level === filterLevel : true;
    
    return matchesSearch && matchesLevel;
  });

  // Type guard to check if item is a WorkoutPlan
  const isWorkoutPlan = (item: ListItem): item is WorkoutPlan => {
    return 'exercises' in item;
  };

  const renderWorkoutCard = ({ item }: { item: WorkoutPlan }) => (
    <TouchableOpacity 
      style={styles.workoutCard}
      onPress={() => setSelectedWorkout(item)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.workoutImage} />
      <View style={styles.workoutCardContent}>
        <Text style={styles.workoutTitle}>{item.title}</Text>
        <View style={styles.workoutMeta}>
          <View style={styles.metaItem}>
            <FontAwesome name="clock-o" size={16} color="#666" />
            <Text style={styles.metaText}>{item.duration}</Text>
          </View>
          <View style={styles.metaItem}>
            <FontAwesome name="signal" size={16} color="#666" />
            <Text style={styles.metaText}>{item.level}</Text>
          </View>
          <View style={styles.metaItem}>
            <FontAwesome name="tag" size={16} color="#666" />
            <Text style={styles.metaText}>{item.category}</Text>
          </View>
        </View>
        <Text style={styles.workoutDescription} numberOfLines={2}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  // Render individual exercise card
  const renderExerciseCard = ({ item }: { item: Exercise }) => (
    <TouchableOpacity 
      style={styles.workoutCard}
      onPress={() => {
        setActiveExercise(item);
        setModalVisible(true);
      }}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.workoutImage} />
      <View style={styles.workoutCardContent}>
        <Text style={styles.workoutTitle}>{item.name}</Text>
        <View style={styles.workoutMeta}>
          <View style={styles.metaItem}>
            <FontAwesome name="signal" size={16} color="#666" />
            <Text style={styles.metaText}>{item.level}</Text>
          </View>
          {item.equipment && (
            <View style={styles.metaItem}>
              <FontAwesome name="wrench" size={16} color="#666" />
              <Text style={styles.metaText}>{item.equipment}</Text>
            </View>
          )}
        </View>
        {item.targetMuscles && (
          <Text style={styles.workoutDescription}>
            Targets: {item.targetMuscles.join(', ')}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity 
      style={styles.exerciseItem}
      onPress={() => {
        setActiveExercise(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Text style={styles.exerciseDetail}>{item.sets} sets × {item.reps} reps</Text>
      </View>
      <FontAwesome name="chevron-right" size={16} color="#ccc" />
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: ListItem }) => {
    if (viewType === 'plans' && isWorkoutPlan(item)) {
      return renderWorkoutCard({ item });
    } else if (viewType === 'exercises' && !isWorkoutPlan(item)) {
      return renderExerciseCard({ item });
    }
    return null;
  };

  const handleStartWorkout = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement workout start logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartExercise = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement exercise start logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    } finally {
      setIsLoading(false);
      setModalVisible(false);
    }
  };

  // Exercise details modal
  const renderExerciseModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible && activeExercise !== null}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <FontAwesome name="times" size={24} color="#666" />
          </TouchableOpacity>
          
          {activeExercise?.imageUrl && (
            <Image source={{ uri: activeExercise.imageUrl }} style={styles.exerciseImage} />
          )}
          
          <Text style={styles.modalTitle}>{activeExercise?.name}</Text>
          
          <View style={styles.exerciseStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Sets</Text>
              <Text style={styles.statValue}>{activeExercise?.sets}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Reps</Text>
              <Text style={styles.statValue}>{activeExercise?.reps}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Rest</Text>
              <Text style={styles.statValue}>{activeExercise?.restTime}s</Text>
            </View>
          </View>
          
          <Text style={styles.instructionsTitle}>Instructions:</Text>
          <Text style={styles.instructionsText}>{activeExercise?.instructions}</Text>
          
          <TouchableOpacity 
            style={[styles.startButton, isLoading && styles.buttonDisabled]}
            onPress={handleStartExercise}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.startButtonText}>Start Exercise</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {!selectedWorkout ? (
        <>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Workouts</Text>
              <View style={styles.viewToggle}>
                <TouchableOpacity 
                  style={[styles.toggleButton, viewType === 'plans' && styles.activeToggleButton]}
                  onPress={() => setViewType('plans')}
                >
                  <Text style={[styles.toggleText, viewType === 'plans' && styles.activeToggleText]}>
                    Plans
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.toggleButton, viewType === 'exercises' && styles.activeToggleButton]}
                  onPress={() => setViewType('exercises')}
                >
                  <Text style={[styles.toggleText, viewType === 'exercises' && styles.activeToggleText]}>
                    Exercises
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.searchContainer}>
              <FontAwesome name="search" size={16} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder={viewType === 'plans' ? "Search workout plans..." : "Search exercises..."}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            
            <ScrollView horizontal style={styles.filtersContainer} showsHorizontalScrollIndicator={false}>
              <TouchableOpacity 
                style={[styles.filterChip, filterLevel === null && styles.activeFilterChip]}
                onPress={() => setFilterLevel(null)}
              >
                <Text style={[styles.filterText, filterLevel === null && styles.activeFilterText]}>
                  All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterChip, filterLevel === 'Beginner' && styles.activeFilterChip]}
                onPress={() => setFilterLevel('Beginner')}
              >
                <Text style={[styles.filterText, filterLevel === 'Beginner' && styles.activeFilterText]}>
                  Beginner
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterChip, filterLevel === 'Intermediate' && styles.activeFilterChip]}
                onPress={() => setFilterLevel('Intermediate')}
              >
                <Text style={[styles.filterText, filterLevel === 'Intermediate' && styles.activeFilterText]}>
                  Intermediate
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterChip, filterLevel === 'Advanced' && styles.activeFilterChip]}
                onPress={() => setFilterLevel('Advanced')}
              >
                <Text style={[styles.filterText, filterLevel === 'Advanced' && styles.activeFilterText]}>
                  Advanced
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          
          <FlatList<ListItem>
            data={viewType === 'plans' ? filteredWorkouts : filteredExercises}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.workoutsList}
          />
        </>
      ) : (
        <ScrollView style={styles.detailContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedWorkout(null)}
          >
            <FontAwesome name="arrow-left" size={18} color="#333" />
            <Text style={styles.backText}>All Workouts</Text>
          </TouchableOpacity>
          
          <Image source={{ uri: selectedWorkout.imageUrl }} style={styles.detailImage} />
          
          <View style={styles.detailHeader}>
            <Text style={styles.detailTitle}>{selectedWorkout.title}</Text>
            <View style={styles.detailMeta}>
              <View style={styles.metaItem}>
                <FontAwesome name="clock-o" size={16} color="#666" />
                <Text style={styles.metaText}>{selectedWorkout.duration}</Text>
              </View>
              <View style={styles.metaItem}>
                <FontAwesome name="signal" size={16} color="#666" />
                <Text style={styles.metaText}>{selectedWorkout.level}</Text>
              </View>
            </View>
            <Text style={styles.detailDescription}>{selectedWorkout.description}</Text>
          </View>
          
          <View style={styles.exercisesSection}>
            <Text style={styles.sectionTitle}>Exercises</Text>
            <FlatList
              data={selectedWorkout.exercises}
              renderItem={renderExerciseItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.startWorkoutButton, isLoading && styles.buttonDisabled]}
            onPress={handleStartWorkout}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.startWorkoutText}>Start Workout</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}
      
      {renderExerciseModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.light.border,
    borderRadius: 20,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeToggleButton: {
    backgroundColor: Colors.light.primary,
  },
  toggleText: {
    fontSize: 14,
    color: Colors.light.mediumGray,
  },
  activeToggleText: {
    color: Colors.light.surface,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.border,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
    color: Colors.light.mediumGray,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
  },
  filtersContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.border,
    marginRight: 10,
  },
  activeFilterChip: {
    backgroundColor: Colors.light.primary,
  },
  filterText: {
    fontSize: 14,
    color: Colors.light.mediumGray,
  },
  activeFilterText: {
    color: Colors.light.surface,
    fontWeight: '600',
  },
  workoutsList: {
    padding: 15,
  },
  workoutCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  workoutImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  workoutCardContent: {
    padding: 20,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.light.text,
  },
  workoutMeta: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  metaText: {
    fontSize: 14,
    color: Colors.light.mediumGray,
    marginLeft: 8,
  },
  workoutDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.light.mediumGray,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  exerciseImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.light.text,
  },
  exerciseStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.light.border,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: Colors.light.mediumGray,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: Colors.light.text,
  },
  instructionsText: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.light.mediumGray,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  startButtonText: {
    color: Colors.light.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  exerciseHeader: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 5,
  },
  exerciseDetail: {
    fontSize: 14,
    color: Colors.light.mediumGray,
  },
  detailContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backText: {
    fontSize: 16,
    marginLeft: 8,
    color: Colors.light.text,
  },
  detailImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 16,
    marginBottom: 20,
  },
  detailHeader: {
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 10,
  },
  detailMeta: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  detailDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.light.mediumGray,
  },
  exercisesSection: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 15,
  },
  startWorkoutButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  startWorkoutText: {
    color: Colors.light.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});