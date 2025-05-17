import React from 'react';
import { Link } from 'react-router-dom';
import { useHealth } from '../context/HealthContext';
import { getTodayString, calculateDailyCalories } from '../utils/healthUtils';
import DashboardCard from '../components/DashboardCard';
import { 
  Calendar, 
  Droplet, 
  Timer,
  CupSoda,
  Moon, 
  Dumbbell, 
  Weight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { 
    moodEntries, 
    waterEntries, 
    waterGoal,
    mealEntries,
    sleepEntries,
    weightEntries
  } = useHealth();

  const today = getTodayString();
  
  // Get today's mood
  const todayMood = moodEntries.find(entry => entry.date === today);
  
  // Get today's water intake
  const todayWater = waterEntries.find(entry => entry.date === today);
  
  // Get today's calories
  const todayCalories = calculateDailyCalories(mealEntries, today);
  
  // Get latest sleep entry
  const latestSleepEntry = sleepEntries.length > 0 
    ? sleepEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;
    
  // Get latest weight entry
  const latestWeightEntry = weightEntries.length > 0
    ? weightEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="page-title">Health Dashboard</h1>
        <div className="mt-2 sm:mt-0">
          <Button asChild>
            <Link to="/breathing">Quick Breathing Exercise</Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard
          title="Today's Mood"
          icon={<Calendar />}
          value={todayMood ? (
            <div className="flex items-center">
              <span className="text-3xl mr-2">
                {todayMood.mood === 'happy' ? '😊' :
                 todayMood.mood === 'sad' ? '😢' :
                 todayMood.mood === 'angry' ? '😡' :
                 todayMood.mood === 'neutral' ? '😐' : '😌'}
              </span>
              <span className="capitalize">{todayMood.mood}</span>
            </div>
          ) : 'Not set'}
          description="Track your daily emotions"
          link="/mood"
        />
        
        <DashboardCard
          title="Water Intake"
          icon={<Droplet />}
          value={
            <div className="flex items-center">
              <span className="text-3xl mr-2">💧</span>
              <span>{todayWater ? todayWater.cups : 0} / {waterGoal} cups</span>
            </div>
          }
          description="Stay hydrated for better health"
          link="/water"
          color="bg-gradient-to-br from-blue-500/10 to-blue-600/5"
        />
        
        <DashboardCard
          title="Breathing"
          icon={<Timer />}
          value="Calm your mind"
          description="Take a moment to breathe deeply"
          link="/breathing"
          color="bg-gradient-to-br from-purple-500/10 to-purple-600/5"
        />
        
        <DashboardCard
          title="Today's Calories"
          icon={<CupSoda />}
          value={`${todayCalories} cal`}
          description="Track your nutritional intake"
          link="/meals"
          color="bg-gradient-to-br from-orange-500/10 to-orange-600/5"
        />
        
        <DashboardCard
          title="Sleep"
          icon={<Moon />}
          value={latestSleepEntry 
            ? `${latestSleepEntry.hoursSlept} hours` 
            : 'Not tracked'
          }
          description={latestSleepEntry 
            ? `Last tracked: ${new Date(latestSleepEntry.date).toLocaleDateString()}` 
            : "Track your sleep patterns"
          }
          link="/sleep"
          color="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5"
        />
        
        <DashboardCard
          title="Fitness"
          icon={<Dumbbell />}
          value="Exercise Routines"
          description="Stay active with guided workouts"
          link="/fitness"
          color="bg-gradient-to-br from-red-500/10 to-red-600/5"
        />
        
        <DashboardCard
          title="Weight"
          icon={<Weight />}
          value={latestWeightEntry 
            ? `${latestWeightEntry.weight} kg` 
            : 'Not tracked'
          }
          description={latestWeightEntry 
            ? `Last tracked: ${new Date(latestWeightEntry.date).toLocaleDateString()}` 
            : "Monitor your weight journey"
          }
          link="/weight"
          color="bg-gradient-to-br from-green-500/10 to-green-600/5"
        />
        
        <DashboardCard
          title="Mental Health"
          icon={<Calendar />}
          value="Journal & Reflection"
          description="Track your mental wellbeing"
          link="/journal"
          color="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5"
        />
        
        <DashboardCard
          title="Stretching"
          icon={<Dumbbell />}
          value="Flexibility Sequence"
          description="Improve your flexibility and mobility"
          link="/stretch"
          color="bg-gradient-to-br from-pink-500/10 to-pink-600/5"
        />
      </div>
    </div>
  );
};

export default Index;
