import { useState, useEffect } from 'react';
import './DaySelectionBar.css';

export default function DaySelectionBar({ selectedDate, onDateSelect }) {
  // Generate array of the next 7 days
  const [days, setDays] = useState([]);
  
  useEffect(() => {
    const generateDays = () => {
      const result = [];
      const today = new Date();
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayOfMonth = date.getDate();
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        
        const formattedDate = formatDate(date);
        
        result.push({
          dayOfWeek,
          dayOfMonth,
          month,
          date: formattedDate,
          isToday: i === 0
        });
      }
      
      setDays(result);
    };
    
    generateDays();
  }, []);
  
  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const handleDayClick = (date) => {
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  return (
    <div className="day-selection-bar">
      <div className="days-container">
        {days.map((day, index) => (
          <div 
            key={index}
            className={`day-slot ${selectedDate === day.date ? 'selected' : ''} ${day.isToday ? 'today' : ''}`}
            onClick={() => handleDayClick(day.date)}
          >
            <div className="day-of-week">{day.dayOfWeek}</div>
            <div className="date-display">{day.dayOfMonth}</div>
            <div className="month-display">{day.month}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
