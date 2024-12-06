import React, { Suspense, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Earth from "./Earth";
import Tshirt from "./Tshirt";
import Shirt from "./Shirt";

function Viewer() {
  const [currentModel, setCurrentModel] = useState('shirt');

  return (
    <Box sx={{ width: '100%', height: '500px' }}>
      <Typography variant="body1" color="initial">3D Object Viewer</Typography>
      {/* <Button onClick={() => setCurrentModel('earth')}>Show Earth</Button> */}
      <Button onClick={() => setCurrentModel('shirt')}>Show shirt</Button>
      <Button onClick={() => setCurrentModel('tshirt')}>Show t-shirt</Button>

      {/* <Canvas camera={{ position: [0, 0, 2], fov: 45 }}> */}
      <Canvas >
        <ambientLight intensity={2} />
        <OrbitControls enableZoom={true} enablePan={true} />
        <Suspense fallback={null}>
          {currentModel === 'shirt' ? <Shirt /> : <Tshirt />}
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </Box>
  );
}

export default Viewer;