import React, { useState } from 'react';
import { CupSoda } from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { getTodayString, calculateDailyCalories, generateId } from '../utils/healthUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

const MealLog = () => {
  const { mealEntries, addMealEntry, removeMealEntry } = useHealth();
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  
  const handleAddMeal = () => {
    if (!mealName.trim()) {
      toast.error('Please enter a meal name');
      return;
    }
    
    const calorieValue = parseInt(calories);
    if (isNaN(calorieValue) || calorieValue <= 0) {
      toast.error('Please enter valid calories');
      return;
    }
    
    addMealEntry({
      id: generateId(),
      date: selectedDate,
      name: mealName,
      calories: calorieValue,
      mealType: mealType
    });
    
    setMealName('');
    setCalories('');
    toast.success('Meal added successfully');
  };
  
  const handleDeleteMeal = (id: string) => {
    removeMealEntry(id);
    toast('Meal removed');
  };
  
  // Filter meals for the selected date
  const mealsForDate = mealEntries.filter(meal => meal.date === selectedDate);
  
  // Group meals by type
  const mealsByType: Record<MealType, typeof mealEntries> = {
    breakfast: mealsForDate.filter(meal => meal.mealType === 'breakfast'),
    lunch: mealsForDate.filter(meal => meal.mealType === 'lunch'),
    dinner: mealsForDate.filter(meal => meal.mealType === 'dinner'),
    snack: mealsForDate.filter(meal => meal.mealType === 'snack')
  };
  
  // Calculate total calories for the day
  const totalCalories = calculateDailyCalories(mealsForDate, selectedDate);

  return (
    <div className="page-container">
      <h1 className="page-title">Meal Log</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="health-card lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Add New Meal</h2>
            <CupSoda className="text-primary h-5 w-5" />
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="mealType">Meal Type</Label>
              <Select value={mealType} onValueChange={(value) => setMealType(value as MealType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="mealName">Food Item</Label>
              <Input
                id="mealName"
                placeholder="e.g. Chicken Salad"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                placeholder="e.g. 350"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>
            
            <Button onClick={handleAddMeal} className="w-full">
              Add Meal
            </Button>
          </div>
        </div>
        
        <div className="health-card lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              Meals for {new Date(selectedDate).toLocaleDateString()}
            </h2>
            <div className="text-lg font-bold">
              Total: {totalCalories} calories
            </div>
          </div>
          
          {Object.entries(mealsByType).map(([type, meals]) => (
            <div key={type} className="mb-6">
              <h3 className="text-lg font-semibold capitalize mb-2 flex items-center">
                <span className="mr-2">
                  {type === 'breakfast' ? '🍳' :
                   type === 'lunch' ? '🥗' :
                   type === 'dinner' ? '🍽️' : '🍎'}
                </span>
                {type}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({meals.reduce((sum, meal) => sum + meal.calories, 0)} cal)
                </span>
              </h3>
              
              {meals.length > 0 ? (
                <div className="space-y-2">
                  {meals.map(meal => (
                    <div 
                      key={meal.id}
                      className="flex justify-between items-center p-3 bg-secondary rounded-md"
                    >
                      <div>{meal.name}</div>
                      <div className="flex items-center">
                        <span className="mr-4">{meal.calories} cal</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteMeal(meal.id)}
                        >
                          <span className="sr-only">Delete</span>
                          ✕
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground italic text-sm">No {type} logged yet</div>
              )}
            </div>
          ))}
          
          {totalCalories > 0 && (
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex justify-between text-xl font-bold">
                <span>Daily Total</span>
                <span>{totalCalories} calories</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealLog;
