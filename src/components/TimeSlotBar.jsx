import { useState, useEffect } from 'react';
import { useBookingData } from '../services/bookingDataService';
import './TimeSlotBar.css';

export default function TimeSlotBar({ selectedRoom, selectedDate, onTimeSlotSelect, useMockData = false }) {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const { loading, getBookingsForRoomAndDate } = useBookingData(useMockData);
  
  // Reset selected slot when date changes
  useEffect(() => {
    setSelectedSlot(null);
    if (onTimeSlotSelect) {
      onTimeSlotSelect(null);
    }
  }, [selectedDate, onTimeSlotSelect]);

  // Update current hour every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  // Generate time slots for all 24 hours with more concise labels
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    return {
      hour: i,
      label: String(i).padStart(2, '0'), // Just the hour number padded with zero
      isBooked: false
    };
  });

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
  
  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Handle time slot selection
  const handleTimeSlotClick = (slot) => {
    if (!slot.isBooked) {
      const timeSlot = `${slot.label}:00 - ${String((slot.hour + 1) % 24).padStart(2, '0')}:00`;
      setSelectedSlot(slot.hour);
      
      // Debug log to verify the hour is being sent correctly
      console.log(`Selected time slot: ${timeSlot}, hour: ${slot.hour}`);
      
      if (onTimeSlotSelect) {
        onTimeSlotSelect(timeSlot, slot.hour); // Pass the hour to parent component
      }
    }
  };

  return (
    <div className="time-slot-bar">
      <div className="time-slot-label">
        {selectedRoom ? `${selectedRoom.name} - Time Slots` : 'Select a room to view availability'}
      </div>
      <div className="time-slots-container">
        {markedTimeSlots.map((slot) => (
          <div 
            key={slot.hour} 
            className={`time-slot ${slot.isBooked ? 'booked' : 'available'} 
                      ${slot.isCurrent ? 'current' : ''} 
                      ${selectedSlot === slot.hour ? 'selected' : ''}`}
            title={`${slot.label}:00 - ${slot.isBooked ? 'Booked' : 'Available'}${slot.isCurrent ? ' (Current hour)' : ''}`}
            onClick={() => !slot.isBooked && handleTimeSlotClick(slot)}
          >
            <span className="time-label">{slot.label}</span>
          </div>
        ))}
      </div>
      {loading && <div className="loading-indicator">Loading bookings...</div>}
    </div>
  );
}
