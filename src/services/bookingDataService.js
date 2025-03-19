import { useState, useEffect } from 'react';
import { simulateRandomBookings } from '../utils/seedBookingData';

// Cache for booking data to minimize API calls
let bookingCache = {
  lastUpdated: null,
  data: {}
};

// Format: roomId_date_hour -> booking object
// Example: "101_2023-05-20_14" -> { roomId: "101", date: "2023-05-20", hour: 14, userId: "student123" }

export function useBookingData(useMockData = false) {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState({});
  const [error, setError] = useState(null);

  // Fetch all bookings from the server
  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      
      // Use mock data if requested (useful during development or when API is not available)
      if (useMockData) {
        const mockBookings = simulateRandomBookings();
        const bookingsMap = {};
        
        mockBookings.forEach(booking => {
          const hourMatch = booking.timeSlot.match(/^(\d+):00/);
          if (hourMatch) {
            const hour = parseInt(hourMatch[1]);
            const key = `${booking.roomId}_${booking.date}_${hour}`;
            bookingsMap[key] = booking;
          }
        });
        
        bookingCache = {
          lastUpdated: new Date(),
          data: bookingsMap
        };
        
        setBookings(bookingsMap);
        setLoading(false);
        return;
      }
      
      // Real API call
      const response = await fetch('http://localhost:5000/bookings');
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data = await response.json();
      
      // Transform into our cache format
      const bookingsMap = {};
      data.forEach(booking => {
        const hourMatch = booking.timeSlot.match(/^(\d+):00/);
        if (hourMatch) {
          const hour = parseInt(hourMatch[1]);
          const key = `${booking.roomId}_${booking.date}_${hour}`;
          bookingsMap[key] = booking;
        }
      });
      
      bookingCache = {
        lastUpdated: new Date(),
        data: bookingsMap
      };
      
      setBookings(bookingsMap);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Get booking for a specific slot
  const getBooking = (roomId, date, hour) => {
    const key = `${roomId}_${date}_${hour}`;
    return bookings[key] || null;
  };

  // Check if a slot is booked
  const isSlotBooked = (roomId, date, hour) => {
    return getBooking(roomId, date, hour) !== null;
  };

  // Get all bookings for a room on a specific date
  const getBookingsForRoomAndDate = (roomId, date) => {
    const result = [];
    for (let hour = 0; hour < 24; hour++) {
      const booking = getBooking(roomId, date, hour);
      result.push({
        hour,
        isBooked: booking !== null,
        booking
      });
    }
    return result;
  };

  // Create a new booking
  const createBooking = async (roomId, date, hour, userId) => {
    const timeSlot = `${String(hour).padStart(2, '0')}:00 - ${String((hour + 1) % 24).padStart(2, '0')}:00`;
    
    try {
      const response = await fetch('http://localhost:5000/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId,
          userId,
          date,
          timeSlot
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create booking');
      }
      
      // Update our local cache
      await fetchAllBookings();
      
      return true;
    } catch (err) {
      throw err;
    }
  };
  
  // Initial fetch
  useEffect(() => {
    if (useMockData || !bookingCache.lastUpdated || 
        (new Date() - bookingCache.lastUpdated) > 5 * 60 * 1000) {
      fetchAllBookings();
    } else {
      setBookings(bookingCache.data);
      setLoading(false);
    }
  }, [useMockData]);

  return {
    loading,
    error,
    fetchAllBookings,
    getBooking,
    isSlotBooked,
    getBookingsForRoomAndDate,
    createBooking
  };
}
