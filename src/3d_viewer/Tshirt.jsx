import React from 'react';
import { useGLTF } from '@react-three/drei';

function Tshirt() {
  const { scene } = useGLTF('./tshirt/scene.gltf');
  return <primitive object={scene} scale={[1, 1, 1]} />;
}

export default Tshirt;

useGLTF.preload('./tshirt/scene.gltf');