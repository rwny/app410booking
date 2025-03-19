import { useState } from 'react';
import './styles/Sidebar.css';

export default function Sidebar({ roomData, onClose, selectedDate, onDateChange }) {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  
  function getFormattedDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    onDateChange(newDate);
  };
  
  const handleBookRoom = async () => {
    if (selectedTimeSlot) {
      try {
        const response = await fetch('http://localhost:5000/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roomId: roomData.id,
            userId: 'student123', // Replace with actual user ID
            date: selectedDate,
            timeSlot: selectedTimeSlot,
          }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          setBookingError(data.message || 'An error occurred');
          setBookingSuccess(false);
          return;
        }
        
        setBookingSuccess(true);
        setBookingError(null);
        
        setTimeout(() => {
          setBookingSuccess(false);
        }, 3000);
      } catch (error) {
        setBookingError('Failed to book room');
        setBookingSuccess(false);
      }
    }
  };
  
  return (
    <div className="sidebar">
      <button className="close-button" onClick={onClose}>×</button>
      
      <div className="sidebar-content">
        <h2>{roomData.name}</h2>
        
        <div className="room-status">
          <span className={`status-indicator ${roomData.available ? 'available' : 'booked'}`}></span>
          <span>{roomData.available ? 'Available' : 'Currently Booked'}</span>
        </div>
        
        <div className="room-details">
          <p><strong>Capacity:</strong> {roomData.capacity} people</p>
          <p><strong>Amenities:</strong> {roomData.amenities.join(', ')}</p>
        </div>
        
        {roomData.available && (
          <div className="booking-form">
            <h3>Book This Room</h3>
            
            <p className="select-time-instruction">Click on a time slot in the bar above to select booking time</p>
            
            <button 
              className="book-button" 
              disabled={!selectedTimeSlot}
              onClick={handleBookRoom}
            >
              Book Room
            </button>
            
            {bookingSuccess && (
              <div className="success-message">
                Room booked successfully!
              </div>
            )}
            
            {bookingError && (
              <div className="error-message">
                Error: {bookingError}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
