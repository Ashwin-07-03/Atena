'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  link?: string;
  linkText?: string;
  delay?: number;
}

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  link = '#', 
  linkText = 'Learn more',
  delay = 0 
}: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white dark:bg-background border border-border rounded-xl p-6 shadow-sm group hover:shadow-md transition-all duration-300"
      style={{ 
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
      whileHover={{
        scale: 1.03,
        rotateX: 5,
        rotateY: 5,
        transition: { duration: 0.2 }
      }}
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
        {icon}
      </div>
      
      {/* Content */}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-foreground/70 mb-4">{description}</p>
      
      {/* Link */}
      <Link href={link} className="text-primary font-medium hover:underline inline-flex items-center">
        {linkText}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </Link>
    </motion.div>
  );
};

export default FeatureCard; 