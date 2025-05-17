
import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { getMoodColor } from '../utils/healthUtils';

interface CalendarProps {
  date: Date;
  entries: {
    date: string;
    mood: string;
  }[];
  onSelectDate: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ date, entries, onSelectDate }) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);

  // Create array for empty cells at the start
  const startEmptyCells = Array.from({ length: startDay }, (_, i) => i);

  const getEntryForDay = (day: Date) => {
    const dateString = format(day, 'yyyy-MM-dd');
    return entries.find(entry => entry.date === dateString);
  };

  return (
    <div className="mt-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">{format(date, 'MMMM yyyy')}</h2>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center font-medium mb-2 text-sm">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before the start of month */}
        {startEmptyCells.map(i => (
          <div key={`empty-start-${i}`} className="h-10 p-1"></div>
        ))}
        
        {/* Calendar days */}
        {monthDays.map((day) => {
          const dateString = format(day, 'yyyy-MM-dd');
          const entry = getEntryForDay(day);
          const isToday = format(new Date(), 'yyyy-MM-dd') === dateString;
          
          return (
            <button
              key={dateString}
              onClick={() => onSelectDate(dateString)}
              className={`h-10 flex items-center justify-center rounded-md text-sm relative ${
                isToday ? 'ring-2 ring-primary' : ''
              }`}
            >
              <span className={`flex items-center justify-center w-8 h-8 rounded-full ${entry ? getMoodColor(entry.mood) : ''}`}>
                {format(day, 'd')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
