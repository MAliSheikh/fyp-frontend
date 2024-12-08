import React, { Suspense } from 'react';
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import THoddie from "./T_hoddie"; // Import your 3D model components
import AirJordan from "./Air_jordan";
import AppleWatch from "./Apple_watch";
import Purse from "./Purse";
import Headphones from "./Headphones";
import BlackTShirt from "./Black_t_shirt";

function Viewer({ productId }) {
  console.log("product id : ", productId) // Corrected 'prod' to 'productId'
  // Function to determine which model to render based on productId
  const getModelComponent = () => {
    switch (productId) {
      case 1:
        return <THoddie scale={0.5} />; // Adjusted scale for THoddie
      case 2:
        return <AirJordan scale={0.5} />; // Adjusted scale for AirJordan
      case 3:
        return <AppleWatch scale={10} />; // Adjusted scale for AppleWatch
      case 4:
        return <Purse scale={0.5} />; // Adjusted scale for Purse
      case 5:
        return <Headphones scale={0.5} />; // Adjusted scale for Headphones
      case 6:
        return <BlackTShirt scale={0.5} />; // Adjusted scale for BlackTShirt
      default:
        return null; // or a default model
    }
  };

  return (
    <Canvas>
      <ambientLight intensity={2} />
      <OrbitControls enableZoom={true} enablePan={true} minZoom={0.5} maxZoom={5} /> {/* Limited zoom range */}
      <Suspense fallback={null}>
        {getModelComponent()} {/* Render the appropriate model with adjusted scale */}
        <Environment preset="sunset" />
      </Suspense>
    </Canvas>
  );
}

export default Viewer;