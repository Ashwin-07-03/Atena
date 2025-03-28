'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, BookOpen, Calendar, LineChart } from 'lucide-react';

// Typewriter animation hook
const useTypewriter = (text: string, speed = 40) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, speed, text]);
  
  return { displayText, isComplete };
};

const FeatureItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <motion.div 
    className="flex flex-col items-center gap-3 p-4 rounded-xl bg-primary/5 backdrop-blur-sm border border-primary/10 shadow-juice transition-all duration-300 hover:scale-105 hover:shadow-juice"
    whileHover={{ y: -5 }}
  >
    <div className="text-primary h-10 w-10 flex items-center justify-center animate-pulse-juice">
      {icon}
    </div>
    <span className="text-foreground text-sm text-center font-medium">{text}</span>
  </motion.div>
);

const HeroContent = () => {
  const mainText = "Study smarter, not harder";
  const { displayText, isComplete } = useTypewriter(mainText, 80);
  
  return (
    <div className="w-full text-center space-y-10 px-4">
      {/* Main Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="space-y-6 max-w-3xl mx-auto"
      >
        <motion.div className="relative inline-flex">
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight">
            {displayText}
            <motion.span
              animate={{ opacity: isComplete ? 0 : 1 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              className="absolute ml-2"
            >
              |
            </motion.span>
          </h1>
          <div className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0"></div>
        </motion.div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: isComplete ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Study management tailored to your learning style
        </motion.p>
      </motion.div>
      
      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isComplete ? 1 : 0, y: isComplete ? 0 : 20 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link 
          href="/register" 
          className="px-8 py-4 rounded-xl bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-juice font-medium flex items-center justify-center gap-2 border border-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-juice"
        >
          <span>Get Started Free</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
        <Link 
          href="#demo" 
          className="px-8 py-4 rounded-xl bg-accent/10 text-foreground border border-accent/20 flex items-center justify-center gap-2 shadow-juice transition-all duration-300 hover:scale-105 hover:shadow-juice hover:bg-accent/20"
        >
          <span>Watch Demo</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        </Link>
      </motion.div>
      
      {/* Trust Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isComplete ? 1 : 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="text-muted-foreground text-sm"
      >
        <div className="flex items-center justify-center gap-1">
          <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <div className="mt-2">
          Trusted by 10,000+ students worldwide
        </div>
      </motion.div>
      
      {/* Feature Highlights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isComplete ? 1 : 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4"
      >
        <FeatureItem 
          icon={<Brain className="h-6 w-6" />} 
          text="Personalized AI schedules" 
        />
        <FeatureItem 
          icon={<LineChart className="h-6 w-6" />} 
          text="Grade prediction & analytics" 
        />
        <FeatureItem 
          icon={<Calendar className="h-6 w-6" />} 
          text="Smart deadline reminders" 
        />
        <FeatureItem 
          icon={<BookOpen className="h-6 w-6" />} 
          text="Adapts to your learning style" 
        />
      </motion.div>
    </div>
  );
};

export default HeroContent;