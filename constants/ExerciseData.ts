import { Exercise, WorkoutPlan } from '@/types/workout';

export const exerciseDatabase: Exercise[] = [
  {
    id: '1',
    name: 'Push-ups',
    sets: 3,
    reps: 15,
    restTime: 60,
    instructions: 'Start in plank position. Lower body until chest nearly touches floor. Push back up to starting position.',
    imageUrl: 'https://picsum.photos/id/100/300/200',
    level: 'Beginner',
    equipment: 'None',
    targetMuscles: ['Chest', 'Shoulders', 'Triceps']
  },
  {
    id: '2',
    name: 'Squats',
    sets: 3,
    reps: 20,
    restTime: 60,
    instructions: 'Stand with feet shoulder-width apart. Lower body as if sitting back into chair. Return to standing.',
    imageUrl: 'https://picsum.photos/id/101/300/200',
    level: 'Beginner',
    equipment: 'None',
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings']
  },
  {
    id: '3',
    name: 'Deadlifts',
    sets: 3,
    reps: 8,
    restTime: 90,
    instructions: 'Stand with feet hip-width apart, barbell in front. Hinge at hips, grip bar, and lift by driving through heels.',
    imageUrl: 'https://picsum.photos/id/102/300/200',
    level: 'Intermediate',
    equipment: 'Barbell',
    targetMuscles: ['Hamstrings', 'Glutes', 'Back']
  },
  {
    id: '4',
    name: 'Plank',
    sets: 3,
    reps: 1,
    restTime: 60,
    instructions: 'Hold a plank position for 30-60 seconds. Keep body straight from head to heels.',
    imageUrl: 'https://picsum.photos/id/103/300/200',
    level: 'Beginner',
    equipment: 'None',
    targetMuscles: ['Core', 'Shoulders']
  },
  {
    id: '5',
    name: 'Pull-ups',
    sets: 3,
    reps: 8,
    restTime: 90,
    instructions: 'Hang from pull-up bar with overhand grip. Pull body up until chin clears bar. Lower with control.',
    imageUrl: 'https://picsum.photos/id/104/300/200',
    level: 'Intermediate',
    equipment: 'Pull-up Bar',
    targetMuscles: ['Back', 'Biceps']
  },
  {
    id: '6',
    name: 'Burpees',
    sets: 3,
    reps: 12,
    restTime: 90,
    instructions: 'Start standing. Drop to squat, jump back to plank, do push-up, jump feet to squat, then jump up.',
    imageUrl: 'https://picsum.photos/id/105/300/200',
    level: 'Advanced',
    equipment: 'None',
    targetMuscles: ['Full Body']
  },
  {
    id: '7',
    name: 'Lunges',
    sets: 3,
    reps: 12,
    restTime: 60,
    instructions: 'Step forward into lunge position. Lower back knee toward ground. Push back to standing.',
    imageUrl: 'https://picsum.photos/id/106/300/200',
    level: 'Beginner',
    equipment: 'None',
    targetMuscles: ['Quadriceps', 'Glutes']
  },
  {
    id: '8',
    name: 'Bench Press',
    sets: 4,
    reps: 10,
    restTime: 120,
    instructions: 'Lie on bench, unrack barbell. Lower to chest with control. Press up to full arm extension.',
    imageUrl: 'https://picsum.photos/id/107/300/200',
    level: 'Intermediate',
    equipment: 'Barbell, Bench',
    targetMuscles: ['Chest', 'Shoulders', 'Triceps']
  }
];

export const mockWorkoutPlans: WorkoutPlan[] = [
  {
    id: '1',
    title: 'Beginner Full Body',
    description: 'Perfect introduction to fitness with basic bodyweight exercises',
    level: 'Beginner',
    duration: '30 mins',
    category: 'Strength',
    imageUrl: 'https://picsum.photos/id/200/400/300',
    exercises: [
      exerciseDatabase.find(ex => ex.name === 'Push-ups')!,
      exerciseDatabase.find(ex => ex.name === 'Squats')!,
      exerciseDatabase.find(ex => ex.name === 'Plank')!,
      exerciseDatabase.find(ex => ex.name === 'Lunges')!
    ]
  },
  {
    id: '2',
    title: 'HIIT Cardio Blast',
    description: 'High-intensity interval training for maximum calorie burn',
    level: 'Intermediate',
    duration: '25 mins',
    category: 'Cardio',
    imageUrl: 'https://picsum.photos/id/201/400/300',
    exercises: [
      exerciseDatabase.find(ex => ex.name === 'Burpees')!,
      exerciseDatabase.find(ex => ex.name === 'Squats')!,
      exerciseDatabase.find(ex => ex.name === 'Push-ups')!,
      exerciseDatabase.find(ex => ex.name === 'Lunges')!
    ]
  },
  {
    id: '3',
    title: 'Strength Building',
    description: 'Build serious strength with compound movements',
    level: 'Advanced',
    duration: '45 mins',
    category: 'Strength',
    imageUrl: 'https://picsum.photos/id/202/400/300',
    exercises: [
      exerciseDatabase.find(ex => ex.name === 'Deadlifts')!,
      exerciseDatabase.find(ex => ex.name === 'Bench Press')!,
      exerciseDatabase.find(ex => ex.name === 'Pull-ups')!,
      exerciseDatabase.find(ex => ex.name === 'Squats')!
    ]
  },
  {
    id: '4',
    title: 'Upper Body Focus',
    description: 'Target your upper body muscles with this focused workout',
    level: 'Intermediate',
    duration: '35 mins',
    category: 'Strength',
    imageUrl: 'https://picsum.photos/id/203/400/300',
    exercises: [
      exerciseDatabase.find(ex => ex.name === 'Push-ups')!,
      exerciseDatabase.find(ex => ex.name === 'Pull-ups')!,
      exerciseDatabase.find(ex => ex.name === 'Bench Press')!,
      exerciseDatabase.find(ex => ex.name === 'Plank')!
    ]
  }
];
