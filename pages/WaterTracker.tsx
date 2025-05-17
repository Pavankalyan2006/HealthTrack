
import React from 'react';
import { Droplet } from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { getTodayString, getLastNDays } from '../utils/healthUtils';
import ProgressChart from '../components/ProgressChart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const WaterTracker = () => {
  const { waterEntries, addWaterCup, resetWaterCups, waterGoal, setWaterGoal } = useHealth();
  const [newGoal, setNewGoal] = React.useState(waterGoal.toString());
  
  const today = getTodayString();
  const todayWater = waterEntries.find(entry => entry.date === today);
  const currentCups = todayWater?.cups || 0;
  
  const handleAddWater = () => {
    addWaterCup(today);
    if (currentCups + 1 === waterGoal) {
      toast.success('Congratulations! You reached your water goal for today!');
    } else {
      toast('Added a cup of water');
    }
  };
  
  const handleResetWater = () => {
    resetWaterCups(today);
    toast('Reset water count for today');
  };
  
  const handleUpdateGoal = () => {
    const goal = parseInt(newGoal);
    if (isNaN(goal) || goal <= 0) {
      toast.error('Please enter a valid goal');
      return;
    }
    
    setWaterGoal(goal);
    toast.success(`Water goal updated to ${goal} cups`);
  };
  
  // Prepare data for the chart - last 7 days
  const last7Days = getLastNDays(7);
  const chartData = last7Days.map(date => {
    const entry = waterEntries.find(e => e.date === date);
    return {
      date,
      value: entry?.cups || 0
    };
  });

  const percentCompleted = Math.min(Math.round((currentCups / waterGoal) * 100), 100);

  return (
    <div className="page-container">
      <h1 className="page-title">Water Tracker</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="health-card">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">Today's Progress</h2>
            <Droplet className="text-blue-500 h-5 w-5" />
          </div>
          
          <div className="flex flex-col items-center my-8">
            <div className="relative w-52 h-52 mb-6">
              {/* Water fill animation */}
              <div 
                className="absolute bottom-0 left-0 right-0 bg-blue-400/50 rounded-full transition-all duration-1000 ease-out"
                style={{ height: `${percentCompleted}%`, opacity: 0.7 }}
              ></div>
              
              {/* Cup icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl">🥤</div>
              </div>
              
              {/* Cup count */}
              <div className="absolute inset-0 flex items-center justify-center mt-20">
                <div className="text-3xl font-bold">{currentCups}/{waterGoal}</div>
              </div>
            </div>
            
            <div className="text-lg text-center mb-6">
              {percentCompleted}% of daily goal completed
            </div>
            
            <div className="flex space-x-4">
              <Button onClick={handleAddWater} className="flex items-center">
                <span className="text-lg mr-1">💧</span> Add Cup
              </Button>
              <Button onClick={handleResetWater} variant="outline">
                Reset
              </Button>
            </div>
          </div>
          
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-medium mb-2">Update Daily Goal</h3>
            <div className="flex space-x-2">
              <Input 
                type="number"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                min="1"
                className="w-24"
              />
              <Button onClick={handleUpdateGoal}>Update</Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Recommended daily water intake: 8 cups (2 liters)
            </p>
          </div>
        </div>
        
        <div className="health-card">
          <h2 className="text-xl font-bold mb-4">Water Intake History</h2>
          <ProgressChart 
            data={chartData} 
            color="#3B82F6" 
            yAxisLabel="Cups"
            domain={[0, Math.max(waterGoal, 10)]}
          />
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Benefits of Staying Hydrated</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Maintains body temperature</li>
              <li>Lubricates and cushions joints</li>
              <li>Protects your tissues and spinal cord</li>
              <li>Helps you eliminate waste</li>
              <li>Aids in digestion</li>
              <li>Improves cognitive function</li>
              <li>Enhances physical performance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterTracker;
