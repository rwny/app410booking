import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import BuildingModel from './components/BuildingModel';
import Sidebar from './components/Sidebar';
import TimeSlotBar from './components/TimeSlotBar';
import './App.css';

export default function App() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getFormattedDate());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

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
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
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
      
      <TimeSlotBar 
        selectedRoom={selectedRoom} 
        selectedDate={selectedDate}
        onTimeSlotSelect={handleTimeSlotSelect} 
      />
      
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
          <BuildingModel onRoomClick={handleRoomClick} />
          <OrbitControls />
        </Canvas>
        
        {showSidebar && (
          <Sidebar 
            roomData={selectedRoom} 
            onClose={() => setShowSidebar(false)}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            selectedTimeSlot={selectedTimeSlot}
          />
        )}
      </div>
    </div>
  );
}
