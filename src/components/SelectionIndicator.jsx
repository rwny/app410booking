import React, { useEffect } from 'react';
import './styles/SelectionIndicator.css';
import { useBookingData } from '../services/bookingDataService';

export default function SelectionIndicator({ selectedDate, selectedHour, selectedRoom, useMockData = true }) {
  const { getBooking } = useBookingData(useMockData);
  
  // Debug logging with more detailed information
  useEffect(() => {
    // console.log(`SelectionIndicator: selectedHour=${selectedHour}, type=${typeof selectedHour}, value is ${selectedHour === null ? 'null' : selectedHour}`);
  }, [selectedHour]);
  
  // Check if this specific slot is booked using shared booking data
  const booking = selectedRoom && selectedDate && selectedHour !== null
    ? getBooking(selectedRoom.id, selectedDate, selectedHour)
    : null;

  // Check the actual status field from the booking
  const isBooked = booking ? (booking.status && booking.status.toLowerCase() === "booked") : false;
  
  // Simplified and more robust formatHour function
  const formatHour = (hour) => {
    // If no hour is selected
    if (hour === null || hour === undefined) {
      return 'Not selected';
    }
    
    // Convert to number (if it's not already)
    const hourNum = Number(hour);
    
    // Check if it's a valid number
    if (isNaN(hourNum) || hourNum < 0 || hourNum > 23) {
      console.log(`Invalid hour: ${hour}, converted to ${hourNum}`);
      return 'Not selected';
    }
    
    // Format properly
    const hourStr = String(hourNum).padStart(2, '0');
    const nextHour = String((hourNum + 1) % 24).padStart(2, '0');
    return `${hourStr}:00 - ${nextHour}:00`;
  };
  
  // Display status based on selections and actual booking status
  const availabilityStatus = selectedRoom && selectedDate && selectedHour !== null
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
