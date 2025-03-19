import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import BuildingModel from './components/BuildingModel';
import Sidebar from './components/Sidebar';
import TimeSlotBar from './components/TimeSlotBar';
import DaySelectionBar from './components/DaySelectionBar';
import SelectionIndicator from './components/SelectionIndicator';
// Import is kept but component is not used for now
// import RoomGrid from './components/RoomGrid';
import './App.css';

// Set to true to use mock data instead of real API
const USE_MOCK_DATA = true;

export default function App() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getFormattedDate());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedHour, setSelectedHour] = useState(new Date().getHours()); // Default to current hour

  function getFormattedDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const handleRoomClick = (roomData) => {
    setSelectedRoom(roomData);
    setShowSidebar(true);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Reset selected time slot when date changes
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (timeSlot, hour) => {
    console.log(`App received: timeSlot=${timeSlot}, hour=${hour}`);
    setSelectedTimeSlot(timeSlot);
    setSelectedHour(hour);
  };

  const handleRoomSelect = (roomId) => {
    // Find room data
    const room = {
      id: roomId,
      // We could fetch more details about the room here
      name: `Room ${roomId}`,
      available: true // This would come from the API
    };
    setSelectedRoom(room);
    setShowSidebar(true);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h3>School Room Booking System</h3>
        <nav>
          <button>Login</button>
          <button>My Bookings</button>
        </nav>
      </header>
      
      <div className="dashboard">
        <DaySelectionBar 
          selectedDate={selectedDate} 
          onDateSelect={handleDateChange} 
        />
        
        <TimeSlotBar 
          selectedRoom={selectedRoom} 
          selectedDate={selectedDate}
          onTimeSlotSelect={handleTimeSlotSelect}
          useMockData={USE_MOCK_DATA}
        />
        
        {/* RoomGrid component hidden for now */}
      </div>
      
      <div className="content">
        <SelectionIndicator 
          selectedDate={selectedDate}
          selectedHour={selectedHour}
          selectedRoom={selectedRoom}
          useMockData={USE_MOCK_DATA}
        />
        
        <Canvas shadows camera={{ position: [10, 10, 10], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1} 
            castShadow 
            shadow-mapSize-width={1024} 
            shadow-mapSize-height={1024} 
          />
          <BuildingModel 
            onRoomClick={handleRoomClick}
            selectedDate={selectedDate}
            selectedHour={selectedHour} 
            useMockData={USE_MOCK_DATA}
          />
          <OrbitControls />
        </Canvas>
        
        {showSidebar && (
          <Sidebar 
            roomData={selectedRoom} 
            onClose={() => setShowSidebar(false)}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            selectedTimeSlot={selectedTimeSlot}
            useMockData={USE_MOCK_DATA}
          />
        )}
      </div>
    </div>
  );
}
