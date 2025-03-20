import { useGLTF, Html } from "@react-three/drei";
import { useState, useMemo } from "react";
import * as THREE from "three";

export default function LoadModel() {
  const gltf = useGLTF("./glb/ar15-201.glb");
  const roomID = ["101", "102", "201", "202", "203", "204", "205", "206"];
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Mapping each room ID to a school/university function name
  const roomFunctionMapping = {
    "101": "Chemistry Lab",
    "102": "Physics Lab",
    "201": "Biology Lab",
    "202": "Computer Lab",
    "203": "Lecture Hall",
    "204": "Library",
    "205": "Art Studio",
    "206": "Research Center",
  };

  const roomPositions = useMemo(() => {
    const positions = {};
    roomID.forEach((roomName) => {
      const room = gltf.scene.getObjectByName(roomName);
      if (room) {
        const box = new THREE.Box3().setFromObject(room);
        const center = new THREE.Vector3();
        box.getCenter(center);
        positions[roomName] = center;
      }
    });
    return positions;
  }, [gltf]);

  return (
    <group dispose={null}>
      {gltf.scene.children.map((child) => {
        if (roomID.includes(child.name)) {
          const isSelected = selectedRoom === child.name;
          const position = roomPositions[child.name];

          // Get the base color of the original material
          let baseColor;
          if (child.material) {
            baseColor = child.material.color;
          } else if (child.material && child.material.length > 0) {
            baseColor = child.material[0].color;
          } else {
            baseColor = new THREE.Color("white"); // Default color if no material
          }

          return (
            <group
              key={child.name}
              onClick={() => setSelectedRoom(child.name)}
            >
              <primitive
                object={child.clone()}
                material={
                  isSelected
                    ? new THREE.MeshLambertMaterial({
                        color: baseColor,
                        opacity: 0.5,
                        transparent: true,
                        emissive: "yellow",
                      })
                    : undefined
                }
              />
              {position && (
                <Html position={position} center>
                  <div
                    style={{
                      backgroundColor: "rgba(0,0,0,0.7)",
                      color: "white",
                      padding: "5px",
                      borderRadius: "5px",
                    }}
                  >
                    {child.name} - {roomFunctionMapping[child.name]}
                  </div>
                </Html>
              )}
            </group>
          );
        }
        return <primitive key={child.name} object={child.clone()} />;
      })}
    </group>
  );
}