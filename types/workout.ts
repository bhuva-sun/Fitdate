export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  restTime: number;
  instructions: string;
  imageUrl?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment?: string;
  targetMuscles?: string[];
}

export interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  category: string;
  imageUrl: string;
  exercises: Exercise[];
}