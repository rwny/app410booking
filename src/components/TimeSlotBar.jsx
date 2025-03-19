import { useState, useEffect } from 'react';
import './TimeSlotBar.css';

export default function TimeSlotBar({ selectedRoom, selectedDate, onTimeSlotSelect }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [selectedSlot, setSelectedSlot] = useState(null);
  
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

  // Fetch bookings for the selected room and date
  useEffect(() => {
    if (selectedRoom && selectedDate) {
      setLoading(true);
      fetch(`http://localhost:5000/bookings?roomId=${selectedRoom.id}&date=${selectedDate}`)
        .then(response => response.json())
        .then(data => {
          setBookings(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching bookings:', error);
          setLoading(false);
        });
    }
  }, [selectedRoom, selectedDate]);

  // Mark booked time slots
  const markedTimeSlots = timeSlots.map(slot => {
    // Check if this time slot is booked
    const isBooked = bookings.some(booking => {
      const [startTime] = booking.timeSlot.split(' - ');
      const bookingHour = parseInt(startTime.split(':')[0]);
      return bookingHour === slot.hour;
    });

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
      const timeSlot = `${slot.label}:00 - ${(slot.hour + 1) % 24}:00`;
      setSelectedSlot(slot.hour);
      if (onTimeSlotSelect) {
        onTimeSlotSelect(timeSlot);
      }
    }
  };

  return (
    <div className="time-slot-bar">
      <div className="time-slot-label">
        {selectedRoom ? `${selectedRoom.name} - ${selectedDate}` : 'Select a room to view availability'}
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
