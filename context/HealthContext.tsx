
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Mood = 'happy' | 'sad' | 'angry' | 'neutral' | 'calm';

type MoodEntry = {
  date: string;
  mood: Mood;
  note?: string;
};

type WaterEntry = {
  date: string;
  cups: number;
};

type MealEntry = {
  id: string;
  date: string;
  name: string;
  calories: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
};

type SleepEntry = {
  date: string;
  hoursSlept: number;
  quality?: 'poor' | 'fair' | 'good' | 'excellent';
};

type WeightEntry = {
  date: string;
  weight: number;
};

type WorkoutEntry = {
  id: string;
  date: string;
  completed: boolean;
  exercises: {
    name: string;
    duration: number;
    completed: boolean;
  }[];
};

interface HealthContextType {
  // Mood tracking
  moodEntries: MoodEntry[];
  addMoodEntry: (entry: MoodEntry) => void;
  
  // Water tracking
  waterEntries: WaterEntry[];
  addWaterCup: (date: string) => void;
  resetWaterCups: (date: string) => void;
  waterGoal: number;
  setWaterGoal: (goal: number) => void;
  
  // Meal logging
  mealEntries: MealEntry[];
  addMealEntry: (entry: MealEntry) => void;
  removeMealEntry: (id: string) => void;
  
  // Sleep tracking
  sleepEntries: SleepEntry[];
  addSleepEntry: (entry: SleepEntry) => void;
  
  // Weight tracking
  weightEntries: WeightEntry[];
  addWeightEntry: (entry: WeightEntry) => void;
  
  // Workout tracking
  workoutEntries: WorkoutEntry[];
  addWorkoutEntry: (entry: WorkoutEntry) => void;
  updateWorkoutEntry: (id: string, completed: boolean) => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

// Helper function to get today's date in YYYY-MM-DD format
const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const HealthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or with default values
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(() => {
    const saved = localStorage.getItem('healthApp.moodEntries');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [waterEntries, setWaterEntries] = useState<WaterEntry[]>(() => {
    const saved = localStorage.getItem('healthApp.waterEntries');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [waterGoal, setWaterGoal] = useState<number>(() => {
    const saved = localStorage.getItem('healthApp.waterGoal');
    return saved ? parseInt(saved) : 8;
  });
  
  const [mealEntries, setMealEntries] = useState<MealEntry[]>(() => {
    const saved = localStorage.getItem('healthApp.mealEntries');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>(() => {
    const saved = localStorage.getItem('healthApp.sleepEntries');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>(() => {
    const saved = localStorage.getItem('healthApp.weightEntries');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [workoutEntries, setWorkoutEntries] = useState<WorkoutEntry[]>(() => {
    const saved = localStorage.getItem('healthApp.workoutEntries');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem('healthApp.moodEntries', JSON.stringify(moodEntries));
  }, [moodEntries]);
  
  useEffect(() => {
    localStorage.setItem('healthApp.waterEntries', JSON.stringify(waterEntries));
  }, [waterEntries]);
  
  useEffect(() => {
    localStorage.setItem('healthApp.waterGoal', JSON.stringify(waterGoal));
  }, [waterGoal]);
  
  useEffect(() => {
    localStorage.setItem('healthApp.mealEntries', JSON.stringify(mealEntries));
  }, [mealEntries]);
  
  useEffect(() => {
    localStorage.setItem('healthApp.sleepEntries', JSON.stringify(sleepEntries));
  }, [sleepEntries]);
  
  useEffect(() => {
    localStorage.setItem('healthApp.weightEntries', JSON.stringify(weightEntries));
  }, [weightEntries]);
  
  useEffect(() => {
    localStorage.setItem('healthApp.workoutEntries', JSON.stringify(workoutEntries));
  }, [workoutEntries]);
  
  // Add a new mood entry
  const addMoodEntry = (entry: MoodEntry) => {
    setMoodEntries(prev => {
      // Remove any existing entry for this date
      const filtered = prev.filter(e => e.date !== entry.date);
      return [...filtered, entry];
    });
  };
  
  // Add a cup of water for a specific date
  const addWaterCup = (date: string) => {
    setWaterEntries(prev => {
      const existingEntry = prev.find(e => e.date === date);
      if (existingEntry) {
        return prev.map(e => 
          e.date === date ? { ...e, cups: e.cups + 1 } : e
        );
      } else {
        return [...prev, { date, cups: 1 }];
      }
    });
  };
  
  // Reset water cups for a specific date
  const resetWaterCups = (date: string) => {
    setWaterEntries(prev => {
      return prev.filter(e => e.date !== date);
    });
  };
  
  // Add a new meal entry
  const addMealEntry = (entry: MealEntry) => {
    setMealEntries(prev => [...prev, entry]);
  };
  
  // Remove a meal entry
  const removeMealEntry = (id: string) => {
    setMealEntries(prev => prev.filter(e => e.id !== id));
  };
  
  // Add a new sleep entry
  const addSleepEntry = (entry: SleepEntry) => {
    setSleepEntries(prev => {
      // Remove any existing entry for this date
      const filtered = prev.filter(e => e.date !== entry.date);
      return [...filtered, entry];
    });
  };
  
  // Add a new weight entry
  const addWeightEntry = (entry: WeightEntry) => {
    setWeightEntries(prev => {
      // Remove any existing entry for this date
      const filtered = prev.filter(e => e.date !== entry.date);
      return [...filtered, entry];
    });
  };
  
  // Add a new workout entry
  const addWorkoutEntry = (entry: WorkoutEntry) => {
    setWorkoutEntries(prev => [...prev, entry]);
  };
  
  // Update a workout entry
  const updateWorkoutEntry = (id: string, completed: boolean) => {
    setWorkoutEntries(prev => 
      prev.map(e => e.id === id ? { ...e, completed } : e)
    );
  };
  
  return (
    <HealthContext.Provider
      value={{
        moodEntries,
        addMoodEntry,
        waterEntries,
        addWaterCup,
        resetWaterCups,
        waterGoal,
        setWaterGoal,
        mealEntries,
        addMealEntry,
        removeMealEntry,
        sleepEntries,
        addSleepEntry,
        weightEntries,
        addWeightEntry,
        workoutEntries,
        addWorkoutEntry,
        updateWorkoutEntry
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
