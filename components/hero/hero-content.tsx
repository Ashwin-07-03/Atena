'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const FeatureItem = ({ icon, text }: { icon: string; text: string }) => (
  <div className="flex flex-col items-center">
    <span className="text-2xl mb-2">{icon}</span>
    <span className="text-[#666] text-sm">{text}</span>
  </div>
);

const HeroContent = () => {
  return (
    <div className="w-full text-center space-y-8">
      {/* Main Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="space-y-4 max-w-3xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight">
          Study smarter, not harder
        </h1>
        <p className="text-lg md:text-xl text-[#4A4A4A] dark:text-neutral-400 max-w-2xl mx-auto">
          AI-powered study management tailored to your learning style.
        </p>
      </motion.div>
      
      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link 
          href="/register" 
          className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-black hover:bg-white hover:text-black border border-black transition-all duration-200"
        >
          Get Started 
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
        <Link 
          href="#demo" 
          className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-black dark:text-white border border-black dark:border-white bg-transparent hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-200"
        >
          Watch Demo
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        </Link>
      </motion.div>
      
      {/* Trust Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="text-[#888] text-sm italic"
      >
        Trusted by 10,000+ students worldwide
      </motion.div>
      
      {/* Feature Highlights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto pt-8"
      >
        <FeatureItem icon="" text="Personalized AI schedules" />
        <FeatureItem icon="" text="Grade prediction & analytics" />
        <FeatureItem icon="" text="Smart deadline reminders" />
        <FeatureItem icon="" text="Adapts to your learning style" />
      </motion.div>
    </div>
  );
};

export default HeroContent; 