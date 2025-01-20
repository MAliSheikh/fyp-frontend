import React, { Suspense } from 'react';
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import THoddie from "./T_hoddie"; 
import AirJordan from "./Air_jordan";
import AppleWatch from "./Apple_watch";
import Purse from "./Purse";
import Headphones from "./Headphones";
import BlackTShirt from "./Black_t_shirt";

function Viewer({ productId }) {
  console.log("product id : ", productId) 
 
  const getModelComponent = () => {
    switch (productId) {
      case 1:
        return <THoddie scale={0.5} />; 
      case 2:
        return <AirJordan scale={0.5} />; 
      case 3:
        return <AppleWatch scale={0.5} />; 
      case 4:
        return <Purse scale={0.5} />;
      case 5:
        return <Headphones />;
      case 6:
        return <BlackTShirt scale={0.5} />; 
      default:
        return null; 
    }
  };

  return (
    <Canvas>
      <ambientLight intensity={2} />
      <OrbitControls enableZoom={true} enablePan={true} minZoom={0.5} maxZoom={5} />
      <Suspense fallback={null}>
        {getModelComponent()}
        <Environment preset="sunset" />
      </Suspense>
    </Canvas>
  );
}

export default Viewer;