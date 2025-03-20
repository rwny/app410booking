import React, { useState } from 'react';
import { useBookingData } from '../services/bookingDataService';
import './styles/Sidebar.css';

export default function Sidebar({ roomData, onClose, selectedDate, selectedHour, useMockData = false }) {
  // Room function mapping (same as in LoadModel.jsx)
  const roomFunctionMapping = {
    "101": "Chemistry Lab",
    "102": "Physics Lab",
    "201": "Biology Lab",
    "202": "Computer Lab",
    "203": "Lecture Hall",
    "204": "Library",
    "205": "Art Studio",
    "206": "Research Center",
  };

  // Selection Indicator functionality
  const [isVisible, setIsVisible] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { getBookingsForRoomAndDate } = useBookingData(useMockData);

  // Toggle functions
  const toggleVisibility = () => {
    setIsVisible(prev => !prev);
  };

  const toggleAdminMode = () => {
    setIsAdmin(prev => !prev);
  };
  
  // Check if there's anything selected
  const hasSelection = selectedDate && selectedHour !== null && roomData;
  
  // Get booking status for the selected time slot
  const getBookingStatus = () => {
    if (!hasSelection) return null;
    
    try {
      const bookings = getBookingsForRoomAndDate(roomData.id, selectedDate);
      // For 3-hour time slots, we need to adjust the index
      const timeSlotIndex = Math.floor(selectedHour / 3);
      return bookings && bookings[timeSlotIndex] ? bookings[timeSlotIndex].isBooked : false;
    } catch (error) {
      console.error('Error checking booking status:', error);
      return false;
    }
  };
  
  const isBooked = hasSelection ? getBookingStatus() : false;
  
  // Function to format the time slot for display
  const formatTimeSlot = (hour) => {
    if (hour === null) return '';
    const startHour = String(hour).padStart(2, '0');
    const endHour = String((hour + 3) % 24).padStart(2, '0');
    return `${startHour}:00 - ${endHour}:00`;
  };

  // Handle the case when no room is selected yet
  if (!roomData) {
    return (
      <div className="sidebar">
        <button className="close-button" onClick={onClose}>×</button>
        <div className="sidebar-content">
          <h2>Welcome to Room Booking</h2>
          <div className="welcome-message">
            <p>Please select a room to view details and make bookings.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar">
      <button className="close-button" onClick={onClose}>×</button>
      
      {/* Selection Indicator at the top of sidebar */}
      <div className="selection-summary">
        {isAdmin && (
          <div className="admin-controls">
            <button 
              className="toggle-button"
              onClick={toggleVisibility}
            >
              {isVisible ? 'Hide Summary' : 'Show Summary'}
            </button>
          </div>
        )}
        
        {(isVisible || isAdmin) && (
          <div className={`summary-content ${!isVisible ? 'admin-preview' : ''}`}>
            {hasSelection ? (
              <>
                <div className="selection-details">
                  <span className="detail-label">Room:</span> 
                  <span className="detail-value">{roomData.name}</span>
                </div>
                <div className="selection-details">
                  <span className="detail-label">Date:</span> 
                  <span className="detail-value">{selectedDate}</span>
                </div>
                <div className="selection-details">
                  <span className="detail-label">Time:</span> 
                  <span className="detail-value">{formatTimeSlot(selectedHour)}</span>
                </div>
                <div className="status-indicator">
                  <span className={`status-dot ${isBooked ? 'booked' : 'available'}`}></span>
                  <span className="status-text">{isBooked ? 'Booked' : 'Available'}</span>
                </div>
              </>
            ) : (
              <div className="no-selection">
                Please select a room, date, and time slot.
              </div>
            )}
          </div>
        )}
        
        {/* Admin mode toggle button */}
        <button 
          className="admin-toggle" 
          onClick={toggleAdminMode}
          title="Toggle Admin Mode"
        >
          {isAdmin ? '👑' : '👤'}
        </button>
      </div>
      
      {/* Original sidebar content */}
      <div className="sidebar-content">
        <h2>Room Details</h2>
        <div className="room-info">
          <p className="room-id">Room {roomData.id}</p>
          <p className="room-function">{roomFunctionMapping[roomData.id]}</p>
        </div>
        <div className="room-image">
          {/* Placeholder for room image */}
          <div className="image-placeholder">
            {roomData.id} - {roomFunctionMapping[roomData.id]}
          </div>
        </div>
      </div>
    </div>
  );
}
