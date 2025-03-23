"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const universityLogos = [
  { name: 'Harvard University', logo: '/images/harvard.svg' },
  { name: 'MIT', logo: '/images/mit.svg' },
  { name: 'Stanford University', logo: '/images/stanford.svg' },
  { name: 'Yale University', logo: '/images/yale.svg' },
  { name: 'Princeton University', logo: '/images/princeton.svg' },
  { name: 'UC Berkeley', logo: '/images/berkeley.svg' },
];

const SocialProof: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const logos = containerRef.current.querySelectorAll('.logo-item');
    
    gsap.fromTo(
      logos,
      { 
        opacity: 0,
        y: 20
      },
      { 
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out"
      }
    );

    return () => {
      const triggers = ScrollTrigger.getAll();
      triggers.forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="mt-12 lg:mt-16 w-full max-w-5xl mx-auto px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <div className="text-center mb-6">
        <h3 className="text-base font-medium text-foreground/60 mb-2">
          Trusted by students at top universities worldwide
        </h3>
      </div>
      
      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
        {universityLogos.map((university, index) => (
          <div 
            key={university.name} 
            className="logo-item relative h-8 transition-all duration-300 hover:opacity-80"
          >
            <Image
              src={university.logo}
              alt={`${university.name} logo`}
              width={120}
              height={32}
              className="h-8 w-auto grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SocialProof;