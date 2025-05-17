
import React, { useState } from 'react';
import { Weight, ChartLine } from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { getTodayString } from '../utils/healthUtils';
import ProgressChart from '../components/ProgressChart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const WeightTracker = () => {
  const { weightEntries, addWeightEntry } = useHealth();
  const [weight, setWeight] = useState('');
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [goal, setGoal] = useState('70');
  
  // Get existing entry for the selected date
  const existingEntry = weightEntries.find(entry => entry.date === selectedDate);
  
  // Initialize from existing entry
  React.useEffect(() => {
    if (existingEntry) {
      setWeight(existingEntry.weight.toString());
    } else {
      setWeight('');
    }
  }, [existingEntry, selectedDate]);
  
  const handleSaveWeight = () => {
    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      toast.error('Please enter a valid weight');
      return;
    }
    
    addWeightEntry({
      date: selectedDate,
      weight: weightValue
    });
    
    toast.success('Weight data saved successfully');
  };
  
  // Sort entries by date for chart
  const sortedEntries = [...weightEntries].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Prepare data for the chart
  const chartData = sortedEntries.map(entry => ({
    date: entry.date,
    value: entry.weight
  }));
  
  // Calculate stats
  const latestWeight = sortedEntries.length > 0 
    ? sortedEntries[sortedEntries.length - 1].weight 
    : 0;
    
  const startWeight = sortedEntries.length > 0 
    ? sortedEntries[0].weight 
    : 0;
    
  const weightChange = startWeight ? latestWeight - startWeight : 0;
  const goalWeight = parseFloat(goal);
  const goalDifference = latestWeight ? goalWeight - latestWeight : 0;

  return (
    <div className="page-container">
      <h1 className="page-title">Weight Tracker</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="health-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Log Weight</h2>
            <Weight className="text-primary h-5 w-5" />
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="weight-date">Date</Label>
              <Input
                type="date"
                id="weight-date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="e.g. 70.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                step="0.1"
                min="0"
              />
            </div>
            
            <Button onClick={handleSaveWeight} className="w-full">
              Save Weight
            </Button>
          </div>
          
          <div className="mt-8 space-y-4">
            <div>
              <Label htmlFor="weight-goal">Weight Goal (kg)</Label>
              <Input
                id="weight-goal"
                type="number"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                step="0.1"
                min="0"
              />
            </div>
            
            {latestWeight > 0 && goalWeight > 0 && (
              <div className="p-4 bg-secondary rounded-md">
                <div className="text-sm text-muted-foreground mb-1">Goal Progress</div>
                <div className="flex justify-between items-center mb-2">
                  <span>Current: {latestWeight.toFixed(1)} kg</span>
                  <span>Goal: {goalWeight.toFixed(1)} kg</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 mb-1">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ 
                      width: `${Math.max(0, Math.min(100, ((latestWeight - Math.min(startWeight, goalWeight)) / Math.abs(goalWeight - Math.min(startWeight, goalWeight))) * 100))}%` 
                    }}
                  ></div>
                </div>
                <div className="text-sm">
                  {goalDifference > 0 
                    ? `${goalDifference.toFixed(1)} kg to lose` 
                    : goalDifference < 0
                      ? `${Math.abs(goalDifference).toFixed(1)} kg to gain`
                      : "Goal reached! 🎉"}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="health-card lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Weight History</h2>
            <ChartLine className="text-primary h-5 w-5" />
          </div>
          
          {chartData.length > 0 ? (
            <>
              <div className="mb-6">
                <ProgressChart 
                  data={chartData} 
                  color="#10B981" 
                  yAxisLabel="Weight (kg)"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Starting Weight</div>
                  <div className="text-2xl font-bold">{startWeight.toFixed(1)} kg</div>
                </Card>
                
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Current Weight</div>
                  <div className="text-2xl font-bold">{latestWeight.toFixed(1)} kg</div>
                </Card>
                
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Change</div>
                  <div className={`text-2xl font-bold ${weightChange < 0 ? 'text-green-500' : weightChange > 0 ? 'text-red-500' : ''}`}>
                    {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                  </div>
                </Card>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">⚖️</div>
              <h3 className="text-lg font-medium mb-2">No Weight Data Yet</h3>
              <p className="text-muted-foreground mb-4">
                Log your weight to start tracking your progress
              </p>
            </div>
          )}
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Recent Records</h3>
            <div className="space-y-2">
              {weightEntries
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map(entry => (
                  <div 
                    key={entry.date}
                    className="p-3 bg-secondary rounded-md flex justify-between"
                    onClick={() => setSelectedDate(entry.date)}
                  >
                    <div>{new Date(entry.date).toLocaleDateString()}</div>
                    <div className="font-medium">{entry.weight.toFixed(1)} kg</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeightTracker;
