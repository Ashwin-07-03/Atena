'use client';

import React, { useState } from 'react';

const DashboardPreview = () => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="relative rounded-xl overflow-hidden shadow-juice border border-primary/15 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 pointer-events-none z-10"></div>
      
      {!imageError ? (
        <img 
          src="/dashboard-preview.png" 
          alt="Atena Dashboard Preview" 
          className="w-full rounded-xl"
          onError={handleImageError}
        />
      ) : (
        <div 
          className="w-full h-[400px] flex items-center justify-center bg-primary/5 rounded-xl"
        >
          <p className="text-muted-foreground">Dashboard Preview Image</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPreview; 