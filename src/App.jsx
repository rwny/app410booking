import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Sidebar from './components/Sidebar';
import TopbarDaySelect from './components/TopbarDaySelect';
import TopbarTimeSelect from './components/TopbarTimeSelect';
import LoadModel from './components/LoadModel';

import './App.css';
import './components/TopbarContainer.css';

// Set to true to use mock data instead of real API
const USE_MOCK_DATA = true;

export default function App() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);

  const handleRoomClick = (roomId) => {
    console.log(`Room clicked: ${roomId}`);
    // Create a room object with the necessary properties
    const room = {
      id: roomId,
      name: `Room ${roomId}`,
      available: true
    };
    setSelectedRoom(room);
    setShowSidebar(true);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Reset selected time slot when date changes
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (timeSlotText, hour) => {
    console.log(`Selected time slot: ${timeSlotText}, hour: ${hour}`);
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
      {/* Top navigation bars */}
      <div className="topbars-wrapper">
        <div className="topbar day-select">
          <TopbarDaySelect 
            selectedDate={selectedDate} 
            onDateSelect={handleDateChange} 
          />
        </div>
        <div className="topbar time-select">
          <TopbarTimeSelect 
            selectedRoom={selectedRoom} 
            selectedDate={selectedDate}
            onTimeSlotSelect={handleTimeSlotSelect}
            useMockData={USE_MOCK_DATA}
          />
        </div>
      </div>
      
      {/* Main content */}
      <div className="main-content">
        {/* 3D canvas */}
        <div className="canvas-wrapper">
          <Canvas shadows camera={{ position: [10, 10, 10], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <directionalLight 
              position={[10, 10, 5]} 
              intensity={1} 
              castShadow 
              shadow-mapSize-width={1024} 
              shadow-mapSize-height={1024} 
            />
            <LoadModel
              onRoomClick={handleRoomClick}
              selectedDate={selectedDate}
              selectedHour={selectedHour}
              useMockData={USE_MOCK_DATA}
            />
            <OrbitControls />
          </Canvas>
        </div>
        
        {/* Sidebar - conditionally rendered */}
        {showSidebar && (
          <div className="sidebar-wrapper">
            <Sidebar 
              roomData={selectedRoom} 
              onClose={() => setShowSidebar(false)}
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              selectedTimeSlot={selectedTimeSlot}
              selectedHour={selectedHour} // Pass selectedHour to Sidebar
              useMockData={USE_MOCK_DATA}
            />
          </div>
        )}
      </div>
    </div>
  );
}
