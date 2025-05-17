
import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const BreathingExercise = () => {
  const [phase, setPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [timer, setTimer] = useState<number>(0);
  const [cycles, setCycles] = useState<number>(0);
  const [totalCycles, setTotalCycles] = useState<number>(3);
  const [isActive, setIsActive] = useState<boolean>(false);
  
  // Configure timings for each phase (in seconds)
  const inhaleDuration = 4;
  const holdDuration = 4;
  const exhaleDuration = 6;
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          // Logic for transitioning between breathing phases
          if (phase === 'inhale' && prevTimer >= inhaleDuration) {
            setPhase('hold');
            return 0;
          } else if (phase === 'hold' && prevTimer >= holdDuration) {
            setPhase('exhale');
            return 0;
          } else if (phase === 'exhale' && prevTimer >= exhaleDuration) {
            // Complete one cycle
            const nextCycles = cycles + 1;
            setCycles(nextCycles);
            
            if (nextCycles >= totalCycles) {
              // Exercise complete
              setIsActive(false);
              setPhase('idle');
              return 0;
            } else {
              // Start next cycle
              setPhase('inhale');
              return 0;
            }
          }
          
          return prevTimer + 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, phase, cycles, totalCycles]);
  
  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setTimer(0);
    setCycles(0);
  };
  
  const stopExercise = () => {
    setIsActive(false);
    setPhase('idle');
    setTimer(0);
  };
  
  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Inhale';
      case 'hold': return 'Hold';
      case 'exhale': return 'Exhale';
      default: return 'Ready?';
    }
  };
  
  const getTimerText = () => {
    if (phase === 'idle') return '';
    
    const maxDuration = 
      phase === 'inhale' ? inhaleDuration : 
      phase === 'hold' ? holdDuration : 
      exhaleDuration;
    
    return `${timer}s / ${maxDuration}s`;
  };
  
  const getProgressPercentage = () => {
    if (phase === 'idle') return 0;
    
    const maxDuration = 
      phase === 'inhale' ? inhaleDuration : 
      phase === 'hold' ? holdDuration : 
      exhaleDuration;
    
    return (timer / maxDuration) * 100;
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Breathing Exercise</h1>
      
      <div className="flex flex-col items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">4-4-6 Breathing</h2>
              <Timer className="text-primary h-5 w-5" />
            </div>
            
            <div className="text-center mb-8">
              <div className="text-sm text-muted-foreground mb-2">
                Cycle {cycles + (isActive ? 1 : 0)} of {totalCycles}
              </div>
              
              <div className="flex justify-center mb-8">
                <div className="relative w-64 h-64 flex items-center justify-center">
                  {/* Background circle */}
                  <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
                  
                  {/* Progress circle */}
                  <div 
                    className={`
                      absolute inset-0 rounded-full border-4 
                      ${phase === 'inhale' ? 'border-blue-400' : 
                      phase === 'hold' ? 'border-amber-400' : 
                      phase === 'exhale' ? 'border-green-400' : 'border-muted'}
                      transition-all duration-1000
                    `}
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, ${getProgressPercentage() > 25 ? '100% 0%' : '50% 0%'}, 
                                ${getProgressPercentage() > 50 ? '100% 100%' : getProgressPercentage() > 25 ? '100% 50%' : '50% 0%'}, 
                                ${getProgressPercentage() > 75 ? '0% 100%' : getProgressPercentage() > 50 ? '50% 100%' : '50% 50%'}, 
                                ${getProgressPercentage() > 75 ? '0% 0%' : '50% 50%'}, 
                                50% 0%)`
                    }}
                  ></div>
                  
                  {/* Breathing animation */}
                  <div 
                    className={`w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center
                      ${phase === 'inhale' ? 'animate-breathe-in' : 
                        phase === 'exhale' ? 'animate-breathe-out' : ''}
                    `}
                  >
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">{getPhaseText()}</div>
                      <div className="text-xl font-semibold">{getTimerText()}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-x-4">
                {!isActive ? (
                  <Button onClick={startExercise} size="lg">
                    Start Breathing
                  </Button>
                ) : (
                  <Button onClick={stopExercise} variant="outline" size="lg">
                    Stop
                  </Button>
                )}
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <h3 className="font-medium text-foreground mb-2">How to practice:</h3>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Inhale deeply through your nose for 4 seconds</li>
                <li>Hold your breath for 4 seconds</li>
                <li>Exhale slowly through your mouth for 6 seconds</li>
                <li>Repeat the cycle 3 times</li>
              </ol>
              <p className="mt-4">This technique helps reduce stress, anxiety, and improve focus.</p>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 max-w-lg">
          <h2 className="text-xl font-bold mb-4">Benefits of Deep Breathing</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Reduces stress and anxiety</li>
            <li>Lowers blood pressure</li>
            <li>Improves immune function</li>
            <li>Increases energy levels</li>
            <li>Improves mental clarity and focus</li>
            <li>Helps manage pain</li>
            <li>Promotes better sleep</li>
            <li>Supports digestive health</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BreathingExercise;
