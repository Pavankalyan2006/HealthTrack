
import { format, parseISO, addDays, subDays } from 'date-fns';

// Get today's date in YYYY-MM-DD format
export const getTodayString = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

// Format date for display
export const formatDate = (dateString: string): string => {
  return format(parseISO(dateString), 'MMMM d, yyyy');
};

// Format date to short display
export const formatShortDate = (dateString: string): string => {
  return format(parseISO(dateString), 'MMM d');
};

// Get the day of week from a date string
export const getDayOfWeek = (dateString: string): string => {
  return format(parseISO(dateString), 'EEE');
};

// Get an array of the last n days (including today)
export const getLastNDays = (n: number): string[] => {
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    dates.push(format(date, 'yyyy-MM-dd'));
  }
  return dates;
};

// Generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Calculate total calories for a day
export const calculateDailyCalories = (
  meals: Array<{ date: string; calories: number }>,
  date: string
): number => {
  return meals
    .filter(meal => meal.date === date)
    .reduce((total, meal) => total + meal.calories, 0);
};

// Calculate average for an array of numbers
export const calculateAverage = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((a, b) => a + b, 0);
  return sum / numbers.length;
};

// Get color for mood
export const getMoodColor = (mood: string): string => {
  const moodColors = {
    happy: 'bg-mood-happy',
    sad: 'bg-mood-sad',
    angry: 'bg-mood-angry',
    neutral: 'bg-mood-neutral',
    calm: 'bg-mood-calm',
  };
  return moodColors[mood as keyof typeof moodColors] || 'bg-gray-200';
};

// Get emoji for mood
export const getMoodEmoji = (mood: string): string => {
  const moodEmojis = {
    happy: '😊',
    sad: '😢',
    angry: '😡',
    neutral: '😐',
    calm: '😌',
  };
  return moodEmojis[mood as keyof typeof moodEmojis] || '🤔';
};

// Get color based on sleep duration
export const getSleepColor = (hours: number): string => {
  if (hours < 6) return 'bg-red-200 text-red-800';
  if (hours < 7) return 'bg-yellow-200 text-yellow-800';
  if (hours < 9) return 'bg-green-200 text-green-800';
  return 'bg-blue-200 text-blue-800';
};

// Calculate BMI
export const calculateBMI = (weightKg: number, heightCm: number): number => {
  if (!weightKg || !heightCm) return 0;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
};

// Get BMI category
export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};
