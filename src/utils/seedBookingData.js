/**
 * Utility script to generate random booking data for testing
 * This can be run from the browser console or as a standalone script
 */

// Configuration
const roomIds = ['101', '102', '103', '104', '105', '106'];
const userIds = ['student123', 'student456', 'teacher789', 'admin001', 'guest002'];
const bookingProbability = 0.2; // 20% chance a slot will be booked

/**
 * Generates dates for the next 7 days
 * @returns {string[]} Array of dates in YYYY-MM-DD format
 */
function getNext7Days() {
  const dates = [];
  const now = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() + i);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    dates.push(`${year}-${month}-${day}`);
  }
  
  return dates;
}

/**
 * Generates a random booking array for all rooms, dates, and hours
 * @returns {Object[]} Array of booking objects
 */
function generateRandomBookings() {
  const bookings = [];
  const dates = getNext7Days();
  
  // For each room, date, and hour slot
  roomIds.forEach(roomId => {
    dates.forEach(date => {
      for (let hour = 0; hour < 24; hour++) {
        // Randomly decide if this slot is booked
        if (Math.random() < bookingProbability) {
          // Create a booking
          const userId = userIds[Math.floor(Math.random() * userIds.length)];
          const timeSlot = `${String(hour).padStart(2, '0')}:00 - ${String((hour + 1) % 24).padStart(2, '0')}:00`;
          
          bookings.push({
            roomId,
            userId,
            date,
            timeSlot
          });
        }
      }
    });
  });
  
  return bookings;
}

/**
 * Seeds the API with random booking data
 * Warning: This will clear existing data if clearExisting is true
 */
async function seedBookingData(clearExisting = true) {
  try {
    // Step 1: Clear existing data if requested
    if (clearExisting) {
      console.log('Clearing existing booking data...');
      // This would require a DELETE endpoint on your API
      // For demonstration, we'll just skip this step
    }
    
    // Step 2: Generate random bookings
    const bookings = generateRandomBookings();
    console.log(`Generated ${bookings.length} random bookings`);
    
    // Step 3: Send bookings to the API
    console.log('Sending bookings to API...');
    let successCount = 0;
    
    for (const booking of bookings) {
      try {
        const response = await fetch('http://localhost:5000/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(booking)
        });
        
        if (response.ok) {
          successCount++;
        } else {
          console.warn(`Failed to create booking: ${JSON.stringify(booking)}`);
        }
      } catch (error) {
        console.error(`Error creating booking: ${error.message}`);
      }
      
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`Successfully created ${successCount} out of ${bookings.length} bookings`);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
  }
}

/**
 * Simulates random bookings without making API requests
 * Returns the generated data for testing
 */
function simulateRandomBookings() {
  const bookings = generateRandomBookings();
  console.log(`Simulated ${bookings.length} random bookings`);
  return bookings;
}

// Export for use in other files
export { seedBookingData, simulateRandomBookings, generateRandomBookings };
