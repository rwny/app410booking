import React, { useState, useEffect } from 'react';
import { useBookingData } from '../services/bookingDataService';
import './styles/SelectionIndicator.css';

export default function SelectionIndicator({ selectedDate, selectedHour, selectedRoom, useMockData = false }) {
  // Add visible state with default as true
  const [isVisible, setIsVisible] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // State to track admin status
  const { getBookingsForRoomAndDate } = useBookingData(useMockData);

  // Toggle function for visibility
  const toggleVisibility = () => {
    setIsVisible(prev => !prev);
  };

  // Toggle admin mode (in a real app, this would be controlled by authentication)
  const toggleAdminMode = () => {
    setIsAdmin(prev => !prev);
  };
  
  // Check if there's anything selected
  const hasSelection = selectedDate && selectedHour !== null && selectedRoom;
  
  // Get booking status for the selected time slot
  const getBookingStatus = () => {
    if (!hasSelection) return null;
    
    try {
      const bookings = getBookingsForRoomAndDate(selectedRoom.id, selectedDate);
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

  // Early return if component should be hidden
  if (!isVisible && !isAdmin) {
    return null;
  }
  
  return (
    <div className="selection-indicator">
      {isAdmin && (
        <div className="admin-controls">
          <button 
            className="toggle-button"
            onClick={toggleVisibility}
          >
            {isVisible ? 'Hide Indicator' : 'Show Indicator'}
          </button>
        </div>
      )}
      
      {/* Only render indicator content if it's visible or in admin mode */}
      {(isVisible || isAdmin) && (
        <div className={`indicator-content ${!isVisible ? 'admin-preview' : ''}`}>
          {hasSelection ? (
            <>
              <div className="selection-details">
                <span className="detail-label">Room:</span> 
                <span className="detail-value">{selectedRoom.name}</span>
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
      
      {/* Admin mode toggle button - in a real app this would be protected */}
      <button 
        className="admin-toggle" 
        onClick={toggleAdminMode}
        title="Toggle Admin Mode"
      >
        {isAdmin ? '👑' : '👤'}
      </button>
    </div>
  );
}
