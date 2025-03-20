import { useState, useEffect, useRef } from 'react';
import { useBookingData } from '../services/bookingDataService';
import './styles/TopbarTimeSelect.css';

export default function TopbarTimeSelect({ selectedRoom, selectedDate, onTimeSlotSelect, useMockData = false }) {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [selectedHour, setSelectedHour] = useState(null);
  const { loading, getBookingsForRoomAndDate } = useBookingData(useMockData);
  const [currentTime, setCurrentTime] = useState(new Date());
  const timelineRef = useRef(null);
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentHour(now.getHours());
      setCurrentTime(now);
    }, 60000);
    return () => clearInterval(timer);
  }, []);
  
  // Reset when the date changes
  useEffect(() => {
    setSelectedHour(null);
    if (onTimeSlotSelect) {
      onTimeSlotSelect(null, null);
    }
  }, [selectedDate]);
  
  // Get booking data for the selected room and date
  const roomBookings = (selectedRoom && selectedDate)
    ? getBookingsForRoomAndDate(selectedRoom.id, selectedDate)
    : [];

  // Generate an array of 8 time slot objects (24 hours / 3 hours per slot)
  const timeSlots = Array.from({ length: 8 }, (_, i) => {
    const startHour = i * 3;
    const endHour = (startHour + 3) % 24;
    let isBooked = false;
    for (let j = startHour; j < startHour + 3; j++) {
      if (roomBookings[j]?.isBooked) {
        isBooked = true;
        break;
      }
    }
    const isNow = currentHour >= startHour && currentHour < startHour + 3 && selectedDate === getTodayDate();
    return {
      startHour: startHour,
      endHour: endHour,
      label: `${String(startHour).padStart(2, '0')}:00 - ${String(endHour).padStart(2, '0')}:00`,
      isNow: isNow,
      isBooked: isBooked
    };
  });
  
  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // Handle click; allow selecting even if the slot is booked so the sidebar can show status.
  function clickTimeSlot(startHour) {
    console.log(`Time slot clicked: ${startHour}`);
    setSelectedHour(startHour);
    const endHour = (startHour + 3) % 24;
    const timeSlotText = `${String(startHour).padStart(2, '0')}:00 - ${String(endHour).padStart(2, '0')}:00`;
    if (onTimeSlotSelect) {
      console.log(`Passing up: ${timeSlotText}, ${startHour}`);
      onTimeSlotSelect(timeSlotText, startHour);
    }
  }
  
  // Calculate position of current time indicator
  const getCurrentTimePosition = () => {
    const now = currentTime;
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Calculate position as percentage of the day
    const totalMinutesInDay = 24 * 60;
    const currentMinutes = hours * 60 + minutes;
    const percentage = (currentMinutes / totalMinutesInDay) * 100;
    
    return `${percentage}%`;
  };
  
  // Determine if current time marker should be visible
  const showCurrentTime = selectedDate === getTodayDate();
  
  return (
    <div className="time-selection-bar">
      <div className="times-container" ref={timelineRef}>
        {timeSlots.map((slot) => (
          <div 
            key={slot.startHour}
            className={`time-slot ${slot.isNow ? 'now' : ''} ${selectedHour === slot.startHour ? 'selected' : ''} ${slot.isBooked ? 'booked' : 'available'}`}
            onClick={() => clickTimeSlot(slot.startHour)}
            title={slot.label}
          >
            <div className="hour-display">{slot.label}</div>
          </div>
        ))}
        
        {showCurrentTime && (
          <div 
            className="current-time-indicator"
            style={{ left: getCurrentTimePosition() }}
          >
            <div className="time-marker"></div>
            <div className="time-label">
              {currentTime.getHours().toString().padStart(2, '0')}:
              {currentTime.getMinutes().toString().padStart(2, '0')}
            </div>
          </div>
        )}
      </div>
      {loading && <div className="loading-indicator">Loading time slots...</div>}
    </div>
  );
}
