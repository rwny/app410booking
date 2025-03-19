import React from 'react';
import './SelectionIndicator.css';
import { useBookingData } from '../services/bookingDataService';

export default function SelectionIndicator({ selectedDate, selectedHour, selectedRoom, useMockData = true }) {
  const { getBooking } = useBookingData(useMockData);
  
  // Check if this specific slot is booked
  const isBooked = selectedRoom && selectedDate && selectedHour !== undefined && selectedHour !== null
    ? getBooking(selectedRoom.id, selectedDate, selectedHour) !== null
    : false;
  
  // Format the hour for display
  const formatHour = (hour) => {
    if (hour === undefined || hour === null) return 'Not selected';
    const hourStr = String(hour).padStart(2, '0');
    const nextHour = String((hour + 1) % 24).padStart(2, '0');
    return `${hourStr}:00 - ${nextHour}:00`;
  };
  
  const availabilityStatus = selectedRoom && selectedDate && selectedHour !== undefined && selectedHour !== null
    ? isBooked ? 'Booked' : 'Available'
    : 'Select date, time, and room';
  
  const availabilityClass = isBooked ? 'booked' : 'available';
  
  return (
    <div className="selection-indicator">
      <div className="selection-header">Current Selection</div>
      <div className="selection-details">
        <div>Date: <span>{selectedDate || 'Not selected'}</span></div>
        <div>Time: <span className="time-value">{formatHour(selectedHour)}</span></div>
        <div>Room: <span>{selectedRoom ? selectedRoom.name : 'Not selected'}</span></div>
        <div className={`availability ${availabilityClass}`}>
          Status: <span>{availabilityStatus}</span>
        </div>
      </div>
    </div>
  );
}
