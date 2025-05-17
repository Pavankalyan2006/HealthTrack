import React, { useState } from 'react';
import { Calendar, BookOpen } from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { getTodayString, generateId } from '../utils/healthUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import EmojiButton from '../components/EmojiButton';

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
}

const MentalHealthJournal = () => {
  const { moodEntries } = useHealth();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('neutral');
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  
  const moods = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '😐', label: 'Neutral', value: 'neutral' },
    { emoji: '😢', label: 'Sad', value: 'sad' },
    { emoji: '😡', label: 'Angry', value: 'angry' },
    { emoji: '😌', label: 'Calm', value: 'calm' },
    { emoji: '😰', label: 'Anxious', value: 'anxious' }
  ];
  
  const handleAddTag = () => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Please enter some content');
      return;
    }
    
    const newEntry: JournalEntry = {
      id: generateId(),
      date: selectedDate,
      title: title.trim(),
      content: content.trim(),
      mood: selectedMood,
      tags: [...tags]
    };
    
    setJournalEntries([...journalEntries, newEntry]);
    
    // Reset form
    setTitle('');
    setContent('');
    setSelectedMood('neutral');
    setTags([]);
    
    toast.success('Journal entry saved');
  };
  
  return (
    <div className="page-container">
      <h1 className="page-title">Mental Health Journal</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="health-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">New Journal Entry</h2>
            <BookOpen className="text-primary h-5 w-5" />
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Give your entry a title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div>
              <Label>How are you feeling?</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {moods.map((mood) => (
                  <EmojiButton
                    key={mood.value}
                    emoji={mood.emoji}
                    label={mood.label}
                    selected={selectedMood === mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="content">Journal Entry</Label>
              <Textarea
                id="content"
                placeholder="Write your thoughts here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
              />
            </div>
            
            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="flex">
                <Input
                  id="tags"
                  placeholder="Add tags"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={handleAddTag} 
                  className="ml-2"
                >
                  Add
                </Button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((t) => (
                    <div 
                      key={t} 
                      className="bg-secondary px-2 py-1 rounded-md flex items-center text-sm"
                    >
                      {t}
                      <button 
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="ml-1 text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Button type="submit" className="w-full">
              Save Journal Entry
            </Button>
          </form>
        </div>
        
        <div className="health-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Entries</h2>
            <Calendar className="text-primary h-5 w-5" />
          </div>
          
          {journalEntries.length > 0 ? (
            <div className="space-y-4">
              {journalEntries
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((entry) => (
                  <div key={entry.id} className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{entry.title}</h3>
                      <div className="text-2xl">
                        {moods.find(m => m.value === entry.mood)?.emoji || '😐'}
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-2">
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                    
                    <p className="text-sm mb-3 line-clamp-3">{entry.content}</p>
                    
                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.map((t) => (
                          <span 
                            key={t} 
                            className="bg-secondary/50 px-2 py-0.5 rounded text-xs"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>No journal entries yet</p>
              <p className="text-sm">Start writing to track your mental wellbeing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentalHealthJournal;
