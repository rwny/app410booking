import React from 'react';
import { useBookingData } from '../services/bookingDataService';
import './RoomGrid.css';

export default function RoomGrid({ selectedDate, onRoomSelect }) {
  const { loading, getBookingsForRoomAndDate } = useBookingData();
  
  // Define the list of rooms
  const roomIds = ['101', '102', '103', '104', '105', '106'];
  
  // Calculate availability percentage for each room on the selected date
  const roomAvailability = roomIds.map(roomId => {
    const bookings = getBookingsForRoomAndDate(roomId, selectedDate);
    const bookedHours = bookings.filter(slot => slot.isBooked).length;
    const availabilityPercentage = ((24 - bookedHours) / 24) * 100;
    
    return {
      roomId,
      availabilityPercentage,
      availableHours: 24 - bookedHours,
      totalHours: 24
    };
  });

  return (
    <div className="room-grid">
      <h3 className="room-grid-title">Room Availability ({selectedDate})</h3>
      
      {loading ? (
        <div className="room-grid-loading">Loading room data...</div>
      ) : (
        <div className="room-grid-container">
          {roomAvailability.map((room) => (
            <div 
              key={room.roomId}
              className="room-grid-item"
              onClick={() => onRoomSelect(room.roomId)}
            >
              <div className="room-id">Room {room.roomId}</div>
              <div className="availability-meter">
                <div 
                  className="availability-bar" 
                  style={{ width: `${room.availabilityPercentage}%` }}
                />
              </div>
              <div className="availability-text">
                {room.availableHours}/{room.totalHours} hours free
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
