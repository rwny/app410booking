import { useState, useEffect } from 'react';
import staticBookings from '../data/booking_data.json';

let bookingCache = {
  lastUpdated: null,
  data: {}
};

export function useBookingData() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState({});
  const [error, setError] = useState(null);

  // Always use static data for booking status
  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      console.log("Static booking data loaded from booking_data.json", staticBookings);
      const bookingsMap = {};
      staticBookings.forEach(booking => {
        const match = booking.timeSlot.match(/^(\d+):00/);
        if (match) {
          const hour = parseInt(match[1]);
          // Use booking.status from JSON: if status is "booked", mark slot as booked; otherwise available.
          const isBooked = booking.status && booking.status.toLowerCase() === "booked";
          const key = `${booking.roomId}_${booking.date}_${hour}`;
          bookingsMap[key] = { ...booking, isBooked };
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

  const getBooking = (roomId, date, hour) => {
    const key = `${roomId}_${date}_${hour}`;
    return bookings[key] || null;
  };

  const isSlotBooked = (roomId, date, hour) => {
    return getBooking(roomId, date, hour) !== null;
  };

  const getBookingsForRoomAndDate = (roomId, date) => {
    const result = [];
    for (let hour = 0; hour < 24; hour++) {
      const booking = getBooking(roomId, date, hour);
      result.push({
        hour,
        // Change this line: Check the actual status of the booking
        isBooked: booking ? (booking.status && booking.status.toLowerCase() === "booked") : false,
        booking
      });
    }
    return result;
  };

  // Stub createBooking in static mode.
  const createBooking = async () => {
    throw new Error("Booking creation is not supported in static mode.");
  };

  // Initial load from the static JSON file.
  useEffect(() => {
    fetchAllBookings();
  }, []);

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
