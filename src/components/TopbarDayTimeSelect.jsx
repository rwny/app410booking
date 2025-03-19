import { useState, useEffect } from 'react';
import { useBookingData } from '../services/bookingDataService';
import './styles/TopbarDayTimeSelect.css';

export default function TopbarDayTimeSelect({ 
  selectedDate, 
  onDateSelect, 
  selectedRoom, 
  onTimeSlotSelect,
  useMockData = false
}) {
  // Time slot state
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const { loading, getBookingsForRoomAndDate } = useBookingData(useMockData);

  // Day selection state
  const [days, setDays] = useState([]);

  // Reset selected time slot when date changes
  useEffect(() => { 
    setSelectedSlot(null);
    if (onTimeSlotSelect) {
      onTimeSlotSelect(null, null);
    }
  }, [selectedDate, onTimeSlotSelect]);

  // Update current hour every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Generate days data on component mount
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

  // Helper functions
  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Day click handler
  const handleDayClick = (date) => {
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  // Generate time slots
  const timeSlots = [];
  for (let i = 0; i < 24; i++) {
    timeSlots.push({
      hour: i,
      label: String(i).padStart(2, '0')
    });
  }

  // Get booking data for the selected room and date
  const roomBookings = selectedRoom && selectedDate ? 
    getBookingsForRoomAndDate(selectedRoom.id, selectedDate) : [];

  // Mark booked time slots
  const markedTimeSlots = timeSlots.map(slot => {
    const isBooked = roomBookings[slot.hour]?.isBooked || false;
    
    return {
      ...slot,
      isBooked,
      isCurrent: slot.hour === currentHour && selectedDate === getTodayDate()
    };
  });

  // Time slot click handler
  function handleTimeClick(hour) {
    const hourNum = Number(hour);
    console.log(`Clicked on time slot hour: ${hourNum}`);
    
    if (Number.isNaN(hourNum) || hourNum < 0 || hourNum > 23) {
      console.error(`Invalid hour value: ${hour}`);
      return;
    }
    
    // Skip if booked
    const timeSlot = markedTimeSlots.find(slot => slot.hour === hourNum);
    if (timeSlot && timeSlot.isBooked) {
      console.log(`Hour ${hourNum} is booked, skipping selection`);
      return;
    }
    
    // Format time slot string
    const hourStr = String(hourNum).padStart(2, '0');
    const nextHourStr = String((hourNum + 1) % 24).padStart(2, '0');
    const timeSlotText = `${hourStr}:00 - ${nextHourStr}:00`;
    
    // Update local state
    setSelectedSlot(hourNum);
    console.log(`Updated selectedSlot to ${hourNum}`);
    
    // Notify parent component
    if (onTimeSlotSelect) {
      console.log(`Sending to App: timeSlot=${timeSlotText}, hour=${hourNum}`);
      onTimeSlotSelect(timeSlotText, hourNum);
    }
  }

  return (
    <div className="topbar-day-time-select">
      {/* Day selection */}
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
      
      {/* Time slot selection */}
      <div className="time-slot-bar">
        <div className="time-slot-label">
          {selectedRoom ? `${selectedRoom.name} - Time Slots` : 'Select a room to view availability'}
        </div>
        
        <div className="time-slots-container">
          {markedTimeSlots.map((slot) => (
            <div 
              key={slot.hour} 
              className={`time-slot 
                        ${slot.isBooked ? 'booked' : 'available'} 
                        ${slot.isCurrent ? 'current' : ''} 
                        ${selectedSlot === slot.hour ? 'selected' : ''}`}
              title={`${slot.label}:00 - ${String((slot.hour + 1) % 24).padStart(2, '0')}:00`}
              onClick={() => handleTimeClick(slot.hour)}
            >
              <span className="time-label">{slot.label}</span>
            </div>
          ))}
        </div>
        
        {loading && <div className="loading-indicator">Loading bookings...</div>}
      </div>
    </div>
  );
}
