import { useState, useEffect } from 'react';
import { useBookingData } from '../services/bookingDataService';
import './styles/TopbarTimeSelect.css';

export default function TopbarTimeSelect({ selectedRoom, selectedDate, onTimeSlotSelect, useMockData = false }) {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [selectedHour, setSelectedHour] = useState(null);
  const { loading, getBookingsForRoomAndDate } = useBookingData(useMockData);
  
  // Update current hour every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHour(new Date().getHours());
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

  // Generate an array of 24 time slot objects with booking info
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const isBooked = roomBookings[i]?.isBooked || false;
    return {
      hour: i,
      label: String(i).padStart(2, '0'),
      isNow: i === currentHour && selectedDate === getTodayDate(),
      isBooked
    };
  });
  
  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // Handle click; do not allow selecting booked slots.
  function clickTimeSlot(hour) {
    console.log(`Time slot clicked: ${hour}`);
    const slot = timeSlots.find(s => s.hour === hour);
    if (slot?.isBooked) {
      console.log(`Hour ${hour} is booked, skipping selection`);
      return;
    }
    setSelectedHour(hour);
    const hourStr = String(hour).padStart(2, '0');
    const nextHourStr = String((hour + 1) % 24).padStart(2, '0');
    const timeSlotText = `${hourStr}:00 - ${nextHourStr}:00`;
    if (onTimeSlotSelect) {
      console.log(`Passing up: ${timeSlotText}, ${hour}`);
      onTimeSlotSelect(timeSlotText, hour);
    }
  }
  
  return (
    <div className="time-selection-bar">
      <div className="time-bar-label">
        {selectedRoom ? `${selectedRoom.name} – Select Time` : 'Select a room to view available times'}
      </div>
      <div className="times-container">
        {timeSlots.map((slot) => (
          <div 
            key={slot.hour}
            className={`time-slot ${slot.isNow ? 'now' : ''} ${selectedHour === slot.hour ? 'selected' : ''} ${slot.isBooked ? 'booked' : 'available'}`}
            onClick={() => { if (!slot.isBooked) clickTimeSlot(slot.hour); }}
            title={`${slot.label}:00 - ${String((slot.hour + 1) % 24).padStart(2, '0')}:00`}
          >
            <div className="hour-display">{slot.label}</div>
          </div>
        ))}
      </div>
      {loading && <div className="loading-indicator">Loading time slots...</div>}
    </div>
  );
}
