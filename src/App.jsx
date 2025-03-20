import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import BuildingModel from './components/BuildingModel';
import Sidebar from './components/Sidebar';
import TopbarDaySelect from './components/TopbarDaySelect';
import TopbarTimeSelect from './components/TopbarTimeSelect';
import SelectionIndicator from './components/SelectionIndicator';
// import LoadGLBModel from './components/LoadGLBModel';
import LoadModel from './components/LoadModel';

import './App.css';
import './components/TopbarContainer.css'; // new CSS for topbar container

// Set to true to use mock data instead of real API
const USE_MOCK_DATA = true;

export default function App() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getFormattedDate());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);

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

  // Fixed time slot handler to ensure it always works
  const handleTimeSlotSelect = (timeSlot, hour) => {
    // console.log(`App received: timeSlot=${timeSlot}, hour=${hour}, type=${typeof hour}`);
    
    setSelectedTimeSlot(timeSlot);
    
    // Special case for null/undefined
    if (hour === null || hour === undefined) {
      // console.log('Setting selectedHour to null');
      setSelectedHour(null);
      return; // Important: exit early
    }
    
    // For numeric values, simple direct assignment
    setSelectedHour(hour);
    // console.log(`Set selectedHour to ${hour}`);
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
      {/* Header removed */}
      {/* Topbar container floating on 3D canvas */}
      <div className="topbar-container">
        <TopbarDaySelect 
          selectedDate={selectedDate} 
          onDateSelect={handleDateChange} 
        />
        <TopbarTimeSelect 
          selectedRoom={selectedRoom} 
          selectedDate={selectedDate}
          onTimeSlotSelect={handleTimeSlotSelect}
          useMockData={USE_MOCK_DATA}
        />
        <SelectionIndicator 
          selectedDate={selectedDate}
          selectedHour={selectedHour}
          selectedRoom={selectedRoom}
          useMockData={USE_MOCK_DATA}
        />
      </div>
      
      <div className="content">
        
        <Canvas shadows camera={{ position: [10, 10, 10], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1} 
            castShadow 
            shadow-mapSize-width={1024} 
            shadow-mapSize-height={1024} 
          />
          {/* <BuildingModel 
            onRoomClick={handleRoomClick}
            selectedDate={selectedDate}
            selectedHour={selectedHour} 
            useMockData={USE_MOCK_DATA}
          /> */}
          {/* <LoadGLBModel /> */}
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="red" />
          </mesh>
          <LoadModel />
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
