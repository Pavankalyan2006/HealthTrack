
import React, { useState, useEffect } from 'react';
import { Timer, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface StretchItem {
  id: string;
  name: string;
  duration: number;
  description: string;
  image: string;
}

const defaultStretches: StretchItem[] = [
  {
    id: 'stretch-1',
    name: 'Neck Stretch',
    duration: 30,
    description: 'Gently tilt your head to each side, holding for a few seconds.',
    image: '🧘‍♀️'
  },
  {
    id: 'stretch-2',
    name: 'Shoulder Rolls',
    duration: 30,
    description: 'Roll your shoulders forwards and backwards in a circular motion.',
    image: '🙆‍♀️'
  },
  {
    id: 'stretch-3',
    name: 'Forward Fold',
    duration: 45,
    description: 'Bend forward from the hips, reaching toward your toes.',
    image: '🧎‍♀️'
  },
  {
    id: 'stretch-4',
    name: 'Quad Stretch',
    duration: 30,
    description: 'Stand on one leg, grab your ankle and pull gently towards your buttocks.',
    image: '🏃‍♀️'
  },
  {
    id: 'stretch-5',
    name: 'Hamstring Stretch',
    duration: 45,
    description: 'Sit with one leg extended, reach toward your toes.',
    image: '🤸‍♀️'
  },
  {
    id: 'stretch-6',
    name: 'Child\'s Pose',
    duration: 60,
    description: 'Kneel and sit back on heels, extending arms forward on the mat.',
    image: '🧘‍♂️'
  }
];

const StretchSequence = () => {
  const [stretches, setStretches] = useState<StretchItem[]>(defaultStretches);
  const [activeStretch, setActiveStretch] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  
  // Handle timer for stretches
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (activeStretch && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval as NodeJS.Timeout);
            const currentIndex = stretches.findIndex(s => s.id === activeStretch);
            if (currentIndex < stretches.length - 1) {
              // Move to next stretch
              const nextStretch = stretches[currentIndex + 1];
              setActiveStretch(nextStretch.id);
              setTimeLeft(nextStretch.duration);
              toast(`Next: ${nextStretch.name}`);
            } else {
              // End of sequence
              setActiveStretch(null);
              toast.success('Stretch sequence completed!');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeStretch, timeLeft, stretches]);
  
  // Start the stretch sequence
  const handleStartSequence = () => {
    if (stretches.length === 0) {
      toast.error('No stretches available');
      return;
    }
    
    const firstStretch = stretches[0];
    setActiveStretch(firstStretch.id);
    setTimeLeft(firstStretch.duration);
    toast(`Starting: ${firstStretch.name}`);
  };
  
  // Reset the stretch sequence
  const handleStopSequence = () => {
    setActiveStretch(null);
    setTimeLeft(0);
  };
  
  // Format time for display (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Move a stretch up in the sequence
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    
    const newStretches = [...stretches];
    [newStretches[index], newStretches[index - 1]] = [newStretches[index - 1], newStretches[index]];
    setStretches(newStretches);
  };
  
  // Move a stretch down in the sequence
  const handleMoveDown = (index: number) => {
    if (index === stretches.length - 1) return;
    
    const newStretches = [...stretches];
    [newStretches[index], newStretches[index + 1]] = [newStretches[index + 1], newStretches[index]];
    setStretches(newStretches);
  };
  
  // Handle drag start
  const handleDragStart = (id: string) => {
    setIsDragging(id);
  };
  
  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  // Handle drop
  const handleDrop = (targetId: string) => {
    if (!isDragging || isDragging === targetId) {
      setIsDragging(null);
      return;
    }
    
    const draggedIndex = stretches.findIndex(s => s.id === isDragging);
    const targetIndex = stretches.findIndex(s => s.id === targetId);
    
    const newStretches = [...stretches];
    const [draggedItem] = newStretches.splice(draggedIndex, 1);
    newStretches.splice(targetIndex, 0, draggedItem);
    
    setStretches(newStretches);
    setIsDragging(null);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Stretch Sequence</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="health-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Stretching Sequence</h2>
            <Timer className="text-primary h-5 w-5" />
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="text-sm text-muted-foreground mb-2">
              Drag to reorder stretches or use the arrows to move them up/down
            </div>
            
            {stretches.map((stretch, index) => (
              <div 
                key={stretch.id}
                className={`p-4 rounded-md 
                  ${activeStretch === stretch.id ? 'bg-primary/20 ring-2 ring-primary' : 'bg-secondary'}
                  ${isDragging === stretch.id ? 'opacity-50' : 'opacity-100'}
                `}
                draggable={!activeStretch}
                onDragStart={() => !activeStretch && handleDragStart(stretch.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(stretch.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="text-3xl mr-3">{stretch.image}</div>
                    <div>
                      <div className="font-medium">{stretch.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {stretch.duration} seconds
                      </div>
                    </div>
                  </div>
                  
                  {!activeStretch && (
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === stretches.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                {activeStretch === stretch.id && (
                  <div className="mt-3">
                    <div className="text-sm mb-2">{stretch.description}</div>
                    <div className="w-full bg-secondary rounded-full h-2 dark:bg-gray-700">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(timeLeft / stretch.duration) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-center space-x-4">
            {!activeStretch ? (
              <Button onClick={handleStartSequence} size="lg">
                Start Sequence
              </Button>
            ) : (
              <Button onClick={handleStopSequence} variant="outline" size="lg">
                Stop Sequence
              </Button>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Active Stretch</h2>
            
            {activeStretch ? (
              <div className="text-center">
                {stretches.find(s => s.id === activeStretch) && (
                  <>
                    <div className="text-6xl mb-4">
                      {stretches.find(s => s.id === activeStretch)?.image}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      {stretches.find(s => s.id === activeStretch)?.name}
                    </h3>
                    <p className="mb-4">
                      {stretches.find(s => s.id === activeStretch)?.description}
                    </p>
                    <div className="text-4xl font-bold mb-2">
                      {formatTime(timeLeft)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Hold this position
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🧘</div>
                <h3 className="text-lg font-medium mb-2">Ready to Stretch?</h3>
                <p className="text-muted-foreground mb-4">
                  Click "Start Sequence" to begin your stretching routine
                </p>
              </div>
            )}
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Benefits of Regular Stretching</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <div className="text-xl mr-2">🔄</div>
                <div>Improves flexibility and range of motion</div>
              </li>
              <li className="flex items-start">
                <div className="text-xl mr-2">💪</div>
                <div>Enhances muscle performance and reduces injury risk</div>
              </li>
              <li className="flex items-start">
                <div className="text-xl mr-2">🩹</div>
                <div>Helps with recovery after exercise</div>
              </li>
              <li className="flex items-start">
                <div className="text-xl mr-2">😌</div>
                <div>Reduces muscle tension and stress</div>
              </li>
              <li className="flex items-start">
                <div className="text-xl mr-2">🧠</div>
                <div>Promotes mindfulness and body awareness</div>
              </li>
            </ul>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p>For best results, hold each stretch for 15-30 seconds and repeat 2-3 times.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StretchSequence;
