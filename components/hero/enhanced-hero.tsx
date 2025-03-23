"use client";

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import HeroContent from './hero-content';
import EnhancedNavigation from './enhanced-navigation';

// Dynamically import ThreeDScene with no SSR
const ThreeDScene = dynamic(() => import('./three-scene'), { 
  ssr: false,
  loading: () => <div className="w-full h-[400px] lg:h-[500px] flex items-center justify-center bg-black/5">Loading 3D Scene...</div>
});

// Simple fallback for the 3D scene if it fails to load
const FallbackGraphic = () => (
  <div className="w-full h-[400px] lg:h-[500px] flex items-center justify-center bg-black/5">
    <div className="p-8 rounded-xl border border-gray-200 dark:border-gray-800">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mb-4 mx-auto opacity-50">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      <p className="text-center text-sm opacity-70">Interactive Book</p>
    </div>
  </div>
);

// Abstract AI Graphic as a fallback
const AbstractAIGraphic = () => (
  <div className="w-full h-[400px] lg:h-[500px] flex items-center justify-center">
    <svg width="320" height="320" viewBox="0 0 320 320" className="opacity-20 dark:opacity-10">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="160" cy="160" r="120" />
        <circle cx="160" cy="160" r="100" />
        <circle cx="160" cy="160" r="80" />
        <line x1="40" y1="160" x2="280" y2="160" />
        <line x1="160" y1="40" x2="160" y2="280" />
        <line x1="80" y1="80" x2="240" y2="240" />
        <line x1="80" y1="240" x2="240" y2="80" />
        {/* Neural network nodes */}
        <circle cx="100" cy="100" r="5" />
        <circle cx="140" cy="80" r="5" />
        <circle cx="180" cy="100" r="5" />
        <circle cx="220" cy="120" r="5" />
        <circle cx="110" cy="160" r="5" />
        <circle cx="150" cy="140" r="5" />
        <circle cx="190" cy="160" r="5" />
        <circle cx="120" cy="200" r="5" />
        <circle cx="160" cy="220" r="5" />
        <circle cx="200" cy="200" r="5" />
        
        {/* Connections */}
        <line x1="100" y1="100" x2="140" y2="80" />
        <line x1="140" y1="80" x2="180" y2="100" />
        <line x1="180" y1="100" x2="220" y2="120" />
        <line x1="110" y1="160" x2="150" y2="140" />
        <line x1="150" y1="140" x2="190" y2="160" />
        <line x1="120" y1="200" x2="160" y2="220" />
        <line x1="160" y1="220" x2="200" y2="200" />
        
        <line x1="100" y1="100" x2="110" y2="160" />
        <line x1="140" y1="80" x2="150" y2="140" />
        <line x1="180" y1="100" x2="190" y2="160" />
        <line x1="110" y1="160" x2="120" y2="200" />
        <line x1="150" y1="140" x2="160" y2="220" />
        <line x1="190" y1="160" x2="200" y2="200" />
      </g>
    </svg>
  </div>
);

const EnhancedHero = () => {
  const useThreeD = false; // Set to false to use Abstract AI Graphic instead of 3D scene

  return (
    <section className="min-h-screen relative overflow-hidden border-b border-[#EEEEEE] dark:border-[#111111]">
      <EnhancedNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-32">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <HeroContent />
          
          <div className="order-first md:order-last">
            {useThreeD ? (
              <Suspense fallback={<FallbackGraphic />}>
                <ThreeDScene />
              </Suspense>
            ) : (
              <AbstractAIGraphic />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHero; 