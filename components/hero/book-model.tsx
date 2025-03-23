'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface BookModelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

const BookModel = ({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0] 
}: BookModelProps) => {
  const bookRef = useRef<THREE.Group>(null);
  const pageRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (bookRef.current) {
      bookRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1 + rotation[1];
    }
    
    if (pageRef.current) {
      pageRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.005 + 0.005;
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.2}
      floatIntensity={0.5}
    >
      {/* Book Group */}
      <group ref={bookRef} position={position} rotation={rotation}>
        {/* Book Cover */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[1, 1.5, 0.1]} />
          <meshStandardMaterial 
            color="#000000" 
            metalness={0}
            roughness={0.8}
          />
        </mesh>
        
        {/* Book Pages */}
        <mesh 
          ref={pageRef}
          castShadow 
          receiveShadow 
          position={[0, 0, 0.06]} 
        >
          <boxGeometry args={[0.95, 1.45, 0.03]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        
        {/* Book Title */}
        <mesh position={[0, 0.2, 0.07]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.7, 0.1]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        
        {/* Book Author */}
        <mesh position={[0, 0, 0.07]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.5, 0.05]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
      
      {/* Shadow */}
      <ContactShadows 
        position={[0, -1.5, 0]} 
        opacity={0.4} 
        scale={10} 
        blur={2} 
      />
    </Float>
  );
};

export default BookModel; 