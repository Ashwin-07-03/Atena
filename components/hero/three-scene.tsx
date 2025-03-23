"use client";

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, PresentationControls } from '@react-three/drei';
import dynamic from 'next/dynamic';

// Dynamically import BookModel with no SSR
const BookModel = dynamic(() => import('./book-model'), { ssr: false });

const ThreeDScene = () => {
  return (
    <div className="w-full h-[400px] lg:h-[500px]">
      {/* Wrap Canvas in an error boundary or conditional rendering */}
      {typeof window !== 'undefined' && (
        <Canvas 
          shadows
          camera={{ position: [0, 0, 5], fov: 50 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <ambientLight intensity={0.5} />
          <spotLight 
            position={[10, 10, 10]} 
            angle={0.15} 
            penumbra={1} 
            intensity={1.5} 
            castShadow 
          />
          <PresentationControls
            global
            rotation={[0.13, 0.1, 0]}
            polar={[-0.4, 0.2]}
            azimuth={[-1, 0.75]}
            // @ts-ignore - drei types are sometimes incomplete
            config={{ mass: 2, tension: 400 }}
            // @ts-ignore - drei types are sometimes incomplete
            snap={{ mass: 4, tension: 400 }}
          >
            <BookModel position={[0, -0.5, 0]} rotation={[0, -0.6, 0]} />
          </PresentationControls>
          <Environment preset="city" />
        </Canvas>
      )}
    </div>
  );
};

export default ThreeDScene; 