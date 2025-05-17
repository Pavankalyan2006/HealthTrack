import React, { useState } from 'react';
import { Moon } from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { getTodayString, getLastNDays } from '../utils/healthUtils';
import ProgressChart from '../components/ProgressChart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const SleepTracker = () => {
  const { sleepEntries, addSleepEntry, sleepGoal, setSleepGoal } = useHealth();
  const [hoursSlept, setHoursSlept] = useState('');
  const [newGoal, setNewGoal] = React.useState(sleepGoal.toString());

  const today = getTodayString();
  const todaySleep = sleepEntries.find(entry => entry.date === today);
  const currentHours = todaySleep?.hoursSlept || 0;

  const handleAddSleep = () => {
    const hours = parseFloat(hoursSlept);
    if (isNaN(hours) || hours <= 0) {
      toast.error('Please enter valid hours');
      return;
    }

    addSleepEntry({
      date: today,
      hoursSlept: hours
    });

    setHoursSlept('');
    toast.success('Sleep data added successfully');
  };

  const handleUpdateGoal = () => {
    const goal = parseInt(newGoal);
    if (isNaN(goal) || goal <= 0) {
      toast.error('Please enter a valid goal');
      return;
    }

    setSleepGoal(goal);
    toast.success(`Sleep goal updated to ${goal} hours`);
  };

  // Prepare data for the chart - last 7 days
  const last7Days = getLastNDays(7);
  const chartData = last7Days.map(date => {
    const entry = sleepEntries.find(e => e.date === date);
    return {
      date,
      value: entry?.hoursSlept || 0
    };
  });

  return (
    <div className="page-container">
      <h1 className="page-title">Sleep Tracker</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="health-card">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">Track Your Sleep</h2>
            <Moon className="text-indigo-500 h-5 w-5" />
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="hours">Hours Slept</Label>
              <Input
                type="number"
                id="hours"
                placeholder="e.g. 7.5"
                value={hoursSlept}
                onChange={(e) => setHoursSlept(e.target.value)}
              />
            </div>

            <Button onClick={handleAddSleep} className="w-full">
              Add Sleep Data
            </Button>
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
              Recommended daily sleep: 7-9 hours
            </p>
          </div>
        </div>

        <div className="health-card">
          <h2 className="text-xl font-bold mb-4">Sleep History</h2>
          <ProgressChart
            data={chartData}
            color="#6366F1"
            yAxisLabel="Hours"
            domain={[0, Math.max(sleepGoal, 10)]}
          />

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Benefits of Good Sleep</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Improved mood and energy levels</li>
              <li>Better cognitive function and memory</li>
              <li>Stronger immune system</li>
              <li>Reduced risk of chronic diseases</li>
              <li>Improved physical performance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepTracker;
