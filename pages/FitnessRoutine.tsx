import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { generateId } from '../utils/healthUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface Exercise {
  id: string;
  name: string;
  duration: number;
  completed: boolean;
}

const FitnessRoutine = () => {
  const { fitnessExercises, addFitnessExercise, updateFitnessExercise, removeFitnessExercise } = useHealth();
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseDuration, setExerciseDuration] = useState('');

  const createExercise = (name: string, duration: number) => {
    return {
      id: generateId(), // Add unique id to each exercise
      name,
      duration,
      completed: false
    };
  };

  const handleAddExercise = () => {
    if (!exerciseName.trim()) {
      toast.error('Please enter an exercise name');
      return;
    }

    const durationValue = parseInt(exerciseDuration);
    if (isNaN(durationValue) || durationValue <= 0) {
      toast.error('Please enter a valid duration');
      return;
    }

    const newExercise = createExercise(exerciseName, durationValue);
    addFitnessExercise(newExercise);

    setExerciseName('');
    setExerciseDuration('');
    toast.success('Exercise added successfully');
  };

  const handleToggleComplete = (id: string) => {
    const exerciseToUpdate = fitnessExercises.find(exercise => exercise.id === id);
    if (exerciseToUpdate) {
      updateFitnessExercise({ ...exerciseToUpdate, completed: !exerciseToUpdate.completed });
    }
  };

  const handleDeleteExercise = (id: string) => {
    removeFitnessExercise(id);
    toast('Exercise removed');
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Fitness Routine</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="health-card lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Add New Exercise</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="exerciseName">Exercise Name</Label>
              <Input
                id="exerciseName"
                placeholder="e.g. Push-ups"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="exerciseDuration">Duration (minutes)</Label>
              <Input
                id="exerciseDuration"
                type="number"
                placeholder="e.g. 15"
                value={exerciseDuration}
                onChange={(e) => setExerciseDuration(e.target.value)}
              />
            </div>

            <Button onClick={handleAddExercise} className="w-full">
              Add Exercise
            </Button>
          </div>
        </div>

        <div className="health-card lg:col-span-1">
          <h2 className="text-xl font-bold mb-4">Current Routine</h2>

          {fitnessExercises.length > 0 ? (
            <div className="space-y-2">
              {fitnessExercises.map(exercise => (
                <div
                  key={exercise.id}
                  className="flex justify-between items-center p-3 bg-secondary rounded-md"
                >
                  <div className="flex items-center">
                    <Checkbox
                      id={`exercise-${exercise.id}`}
                      checked={exercise.completed}
                      onCheckedChange={() => handleToggleComplete(exercise.id)}
                    />
                    <Label htmlFor={`exercise-${exercise.id}`} className="ml-2">
                      {exercise.name} ({exercise.duration} min)
                    </Label>
                  </div>
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteExercise(exercise.id)}
                    >
                      <span className="sr-only">Delete</span>
                      ✕
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground italic text-sm">No exercises added yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FitnessRoutine;
