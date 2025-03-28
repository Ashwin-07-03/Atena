"use client";

import React, { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import HeroContent from './hero-content';
import EnhancedNavigation from './enhanced-navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import ThreeDScene with no SSR
const ThreeDScene = dynamic(() => import('./three-scene'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] lg:h-[500px] flex items-center justify-center bg-primary/5 rounded-xl backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="loading-spinner mb-4"></div>
        <p className="text-sm text-muted-foreground">Loading interactive visualization...</p>
      </motion.div>
    </div>
  )
});

// Animated fruit-inspired background patterns
const FruitPatternBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] z-0">
    {/* Large circle */}
    <motion.div 
      className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full border-[8px] border-primary/30"
      animate={{ 
        scale: [1, 1.05, 1],
        rotate: [0, 5, 0]
      }}
      transition={{ 
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut" 
      }}
    />
    
    {/* Small circles pattern */}
    <div className="absolute top-[20%] left-[10%]">
      <motion.div 
        className="w-20 h-20 rounded-full bg-primary/20"
        animate={{ 
          y: [0, 30, 0],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />
    </div>
    
    <div className="absolute bottom-[15%] right-[15%]">
      <motion.div 
        className="w-32 h-32 rounded-full bg-accent/20"
        animate={{ 
          y: [0, -40, 0],
          opacity: [0.1, 0.25, 0.1]
        }}
        transition={{ 
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </div>
    
    {/* Waving line */}
    <svg className="absolute bottom-0 left-0 w-full h-32 opacity-20" preserveAspectRatio="none">
      <motion.path
        d="M0,32 C150,100 350,-50 500,32 L500,100 L0,100 Z"
        fill="hsl(var(--primary))"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1 }}
      />
    </svg>
  </div>
);

// Enhanced decorative elements
const DecorativeElements = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {/* Floating fruit shapes */}
    <motion.div 
      className="absolute top-[15%] right-[20%] w-4 h-4 rounded-full bg-primary/50"
      animate={{ 
        y: [0, -15, 0],
        x: [0, 10, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{ 
        duration: 5, 
        repeat: Infinity,
        ease: "easeInOut" 
      }}
    />
    
    <motion.div 
      className="absolute top-[30%] left-[15%] w-6 h-6 rounded-full bg-secondary/40"
      animate={{ 
        y: [0, 20, 0],
        x: [0, -10, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{ 
        duration: 7, 
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1 
      }}
    />
    
    <motion.div 
      className="absolute bottom-[25%] right-[30%] w-5 h-5 rounded-full bg-accent/40"
      animate={{ 
        y: [0, -25, 0],
        x: [0, -15, 0],
        scale: [1, 1.15, 1],
      }}
      transition={{ 
        duration: 9, 
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2
      }}
    />
  </div>
);

const EnhancedHero = () => {
  const [useThreeD, setUseThreeD] = useState(false);
  
  // Enable 3D visualization after component mounts to ensure it's only loaded on client
  useEffect(() => {
    const timer = setTimeout(() => {
      setUseThreeD(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen relative overflow-hidden border-b border-primary/10">
      <FruitPatternBackground />
      <DecorativeElements />
      
      <EnhancedNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-32 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <HeroContent />
          
          <div className="order-first md:order-last">
            <AnimatePresence mode="wait">
              {useThreeD ? (
                <motion.div
                  key="3d-scene"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="rounded-2xl overflow-hidden shadow-juice border border-primary/10"
                >
                  <Suspense fallback={<div className="h-[400px] bg-primary/5 flex items-center justify-center"><div className="loading-spinner"></div></div>}>
                    <ThreeDScene />
                  </Suspense>
                </motion.div>
              ) : (
                <motion.div
                  key="abstract-graphic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-[400px] lg:h-[500px] flex items-center justify-center bg-gradient-to-br from-background to-primary/5 rounded-2xl shadow-juice border border-primary/10 backdrop-blur-sm"
                >
                  <svg width="320" height="320" viewBox="0 0 320 320" className="opacity-20">
                    <g fill="none" stroke="currentColor" strokeWidth="1" className="text-primary">
                      <circle cx="160" cy="160" r="120" />
                      <circle cx="160" cy="160" r="100" />
                      <circle cx="160" cy="160" r="80" />
                      <line x1="40" y1="160" x2="280" y2="160" />
                      <line x1="160" y1="40" x2="160" y2="280" />
                      <line x1="80" y1="80" x2="240" y2="240" />
                      <line x1="80" y1="240" x2="240" y2="80" />
                      
                      {/* Neural network nodes */}
                      <motion.circle 
                        cx="100" cy="100" r="5"
                        animate={{ r: [5, 7, 5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.circle 
                        cx="140" cy="80" r="5"
                        animate={{ r: [5, 7, 5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                      />
                      <motion.circle 
                        cx="180" cy="100" r="5"
                        animate={{ r: [5, 7, 5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                      />
                      <motion.circle 
                        cx="220" cy="120" r="5"
                        animate={{ r: [5, 7, 5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
                      />
                      <motion.circle 
                        cx="110" cy="160" r="5"
                        animate={{ r: [5, 7, 5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
                      />
                      <motion.circle 
                        cx="150" cy="140" r="5"
                        animate={{ r: [5, 7, 5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                      />
                      <motion.circle 
                        cx="190" cy="160" r="5"
                        animate={{ r: [5, 7, 5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1.8 }}
                      />
                      <motion.circle 
                        cx="120" cy="200" r="5"
                        animate={{ r: [5, 7, 5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 2.1 }}
                      />
                      <motion.circle 
                        cx="160" cy="220" r="5"
                        animate={{ r: [5, 7, 5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 2.4 }}
                      />
                      <motion.circle 
                        cx="200" cy="200" r="5"
                        animate={{ r: [5, 7, 5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 2.7 }}
                      />
                      
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHero; 