import React from 'react';
import { useGLTF } from '@react-three/drei';

function Earth() {
  const { scene } = useGLTF('./earth/scene.gltf');
  return <primitive object={scene} scale={[1, 1, 1]} />;
}

export default Earth;

useGLTF.preload('./earth/scene.gltf');