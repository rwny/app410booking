import { useGLTF } from "@react-three/drei";

export default function LoadModel() {
  const gltf = useGLTF("./glb/ar15-201.glb");
  return <primitive object={gltf.scene} dispose={null} />;
}

console.log("LoadModel component loaded");