import { useRef, useState, useMemo } from 'react'; 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';

import * as THREE from 'three';

// Create more structured room data with random availability
const generateRoomData = () => {
  const roomTypes = ['Lecture Hall', 'Classroom', 'Lab', 'Seminar Room', 'Study Room', 'Conference Room'];
  const amenitiesList = [
    ['Projector', 'Whiteboard', 'Audio System'],
    ['Smartboard', 'Computers', 'Video Conferencing'],
    ['Lab Equipment', 'Computers', 'Safety Equipment'],
    ['Projector', 'Round Tables', 'Microphones'],
    ['Whiteboards', 'Quiet Space', 'Power Outlets'],
    ['Video Conferencing', 'Large Display', 'Conference Phone']
  ];
  
  // Room IDs are now 101-106 instead of room1-room6
  const roomIds = [101, 102, 103, 104, 105, 106];
  
  return Array(6).fill().map((_, index) => {
    const roomType = roomTypes[index % roomTypes.length];
    const capacity = Math.floor(Math.random() * 30) + 15; // 15-45 capacity
    const available = Math.random() > 0.3; // 70% chance of being available
    
    return {
      id: roomIds[index].toString(), // Convert to string for consistency with API
      name: `${roomType} ${roomIds[index]}`,
      capacity: capacity,
      amenities: amenitiesList[index % amenitiesList.length],
      available: available
    };
  });
};

// Temporary building model with rooms arranged in a 2x3 grid
export default function BuildingModel({ onRoomClick }) {
  const groupRef = useRef();
  
  // Generate room data using useMemo to avoid regenerating on every render
  const roomsData = useMemo(() => generateRoomData(), []);
  
  // Handle room click
  const handleClick = (roomId) => {
    const room = roomsData.find(room => room.id === roomId);
    if (room) {
      onRoomClick(room);
    }
  };

  return (
    <group ref={groupRef}>
      {/* Building base */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[20, 1, 20]} />
        <meshStandardMaterial color="#8c8c8c" />
      </mesh>
      
      {/* Rooms arranged in a 2x3 grid */}
      {/* First row */}
      <Room 
        position={[-7, 1, -3]} 
        size={[5, 2, 4]} 
        color={roomsData[0].available ? "#92d36e" : "#d36e6e"}
        onClick={() => handleClick('101')} 
        label={roomsData[0].name}
      />
      <Room 
        position={[0, 1, -3]} 
        size={[5, 2, 4]} 
        color={roomsData[1].available ? "#92d36e" : "#d36e6e"}
        onClick={() => handleClick('102')}
        label={roomsData[1].name}
      />
      <Room 
        position={[7, 1, -3]} 
        size={[5, 2, 4]} 
        color={roomsData[2].available ? "#92d36e" : "#d36e6e"}
        onClick={() => handleClick('103')}
        label={roomsData[2].name}
      />
      
      {/* Second row */}
      <Room 
        position={[-7, 1, 3]} 
        size={[5, 2, 4]} 
        color={roomsData[3].available ? "#92d36e" : "#d36e6e"}
        onClick={() => handleClick('104')}
        label={roomsData[3].name}
      />
      <Room 
        position={[0, 1, 3]} 
        size={[5, 2, 4]} 
        color={roomsData[4].available ? "#92d36e" : "#d36e6e"}
        onClick={() => handleClick('105')}
        label={roomsData[4].name}
      />
      <Room 
        position={[7, 1, 3]} 
        size={[5, 2, 4]} 
        color={roomsData[5].available ? "#92d36e" : "#d36e6e"}
        onClick={() => handleClick('106')}
        label={roomsData[5].name}
      />
      
      {/* Corridors/hallways */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[20, 0.2, 2]} />
        <meshStandardMaterial color="#b0b0b0" />
      </mesh>
      <mesh position={[-3.5, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.2, 10]} />
        <meshStandardMaterial color="#b0b0b0" />
      </mesh>
      <mesh position={[3.5, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.2, 10]} />
        <meshStandardMaterial color="#b0b0b0" />
      </mesh>
    </group>
  );
}

// Helper component for a room
function Room({ position, size, color, onClick, label }) {
  const meshRef = useRef();
  
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (hovered) {
      meshRef.current.scale.set(1.02, 1.02, 1.02);
    } else {
      meshRef.current.scale.set(1, 1, 1);
    }
  });

  return (
    <mesh 
      ref={meshRef}
      position={position} 
      castShadow 
      receiveShadow
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial 
        color={color} 
        transparent 
        opacity={0.8} 
        emissive={hovered ? color : "#000000"} 
        emissiveIntensity={hovered ? 0.2 : 0}
      />
      {hovered && (
        <Html position={[0, 0, size[2]/2 + 0.1]} center>
          <div style={{
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '12px',
            pointerEvents: 'none'
          }}>
            {label}
          </div>
        </Html>
      )}
    </mesh>
  );
}
