
import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { getTodayString, getMoodEmoji } from '../utils/healthUtils';
import Calendar from '../components/Calendar';
import EmojiButton from '../components/EmojiButton';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const MoodTracker = () => {
  const { moodEntries, addMoodEntry } = useHealth();
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState<string>('');
  
  // Get existing entry for the selected date
  const existingEntry = moodEntries.find(entry => entry.date === selectedDate);
  
  // Initialize selected mood from existing entry
  React.useEffect(() => {
    if (existingEntry) {
      setSelectedMood(existingEntry.mood);
      setNote(existingEntry.note || '');
    } else {
      setSelectedMood(null);
      setNote('');
    }
  }, [existingEntry, selectedDate]);
  
  const handleSaveMood = () => {
    if (!selectedMood) {
      toast.error('Please select a mood');
      return;
    }
    
    addMoodEntry({
      date: selectedDate,
      mood: selectedMood as any,
      note: note
    });
    
    toast.success('Mood saved successfully');
  };
  
  const currentMonth = new Date();
  
  const moodOptions = [
    { emoji: '😊', label: 'Happy', value: 'happy', color: 'bg-mood-happy/30' },
    { emoji: '😌', label: 'Calm', value: 'calm', color: 'bg-mood-calm/30' },
    { emoji: '😐', label: 'Neutral', value: 'neutral', color: 'bg-mood-neutral/30' },
    { emoji: '😢', label: 'Sad', value: 'sad', color: 'bg-mood-sad/30' },
    { emoji: '😡', label: 'Angry', value: 'angry', color: 'bg-mood-angry/30' },
  ];

  return (
    <div className="page-container">
      <h1 className="page-title">Mood Tracker</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="health-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Calendar</h2>
            <CalendarIcon className="text-primary h-5 w-5" />
          </div>
          
          <Calendar 
            date={currentMonth} 
            entries={moodEntries.map(entry => ({ date: entry.date, mood: entry.mood }))} 
            onSelectDate={setSelectedDate}
          />
        </div>
        
        <div className="health-card">
          <h2 className="text-xl font-bold mb-4">
            How are you feeling on {new Date(selectedDate).toLocaleDateString()}?
          </h2>
          
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-6">
            {moodOptions.map(option => (
              <EmojiButton
                key={option.value}
                emoji={option.emoji}
                label={option.label}
                selected={selectedMood === option.value}
                onClick={() => setSelectedMood(option.value)}
                color={option.color}
              />
            ))}
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Notes (Optional)</h3>
            <Textarea
              placeholder="How are you feeling today? What happened?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="h-24"
            />
          </div>
          
          <Button onClick={handleSaveMood} className="w-full">
            Save Mood
          </Button>
        </div>
      </div>
      
      <div className="health-card mt-6">
        <h2 className="text-xl font-bold mb-4">Recent Mood History</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {moodEntries
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 6)
            .map(entry => (
              <div 
                key={entry.date}
                className="p-4 rounded-lg bg-secondary flex items-center"
                onClick={() => setSelectedDate(entry.date)}
              >
                <div className="text-4xl mr-3">
                  {getMoodEmoji(entry.mood)}
                </div>
                <div>
                  <div className="font-medium capitalize">{entry.mood}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
