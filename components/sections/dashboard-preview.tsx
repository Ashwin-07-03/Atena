'use client';

import React, { useState } from 'react';
import { LineChart, Calendar, Clock, BookOpen, CheckSquare, Brain } from 'lucide-react';

const DashboardPreview = () => {
  const [imageError, setImageError] = useState(true); // Default to showing the placeholder

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
        <div className="w-full h-[500px] bg-primary/5 rounded-xl p-8">
          <div className="w-full h-full border-2 border-dashed border-primary/20 rounded-lg flex flex-col items-center justify-center relative">
            {/* Header mockup */}
            <div className="absolute top-4 left-4 right-4 h-12 bg-card/80 rounded-lg flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20"></div>
                <div className="h-4 w-24 bg-foreground/10 rounded"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-foreground/10"></div>
                <div className="h-6 w-6 rounded-full bg-foreground/10"></div>
                <div className="h-6 w-6 rounded-full bg-foreground/10"></div>
              </div>
            </div>
            
            {/* Dashboard content mockup */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl px-4">
              {/* Progress card */}
              <div className="bg-card/70 p-4 rounded-lg flex flex-col gap-2 shadow-juice">
                <div className="flex items-center gap-2">
                  <LineChart className="text-primary w-5 h-5" />
                  <div className="h-4 w-20 bg-foreground/10 rounded"></div>
                </div>
                <div className="h-24 bg-foreground/5 rounded mt-2 flex items-center justify-center">
                  <div className="w-3/4 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded"></div>
                </div>
              </div>
              
              {/* Schedule card */}
              <div className="bg-card/70 p-4 rounded-lg flex flex-col gap-2 shadow-juice">
                <div className="flex items-center gap-2">
                  <Calendar className="text-accent w-5 h-5" />
                  <div className="h-4 w-20 bg-foreground/10 rounded"></div>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-6 bg-foreground/5 rounded flex items-center">
                      <div className="w-1/4 h-4 bg-accent/20 rounded ml-2"></div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Timer card */}
              <div className="bg-card/70 p-4 rounded-lg flex flex-col gap-2 shadow-juice">
                <div className="flex items-center gap-2">
                  <Clock className="text-secondary w-5 h-5" />
                  <div className="h-4 w-20 bg-foreground/10 rounded"></div>
                </div>
                <div className="h-24 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-4 border-secondary/30 flex items-center justify-center">
                    <div className="text-foreground/40 text-xl font-mono animate-pulse-juice">25:00</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tasks section */}
            <div className="absolute bottom-4 left-4 right-4 h-32 bg-card/80 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckSquare className="text-primary w-5 h-5 animate-pulse-juice" />
                <div className="h-4 w-32 bg-foreground/10 rounded"></div>
              </div>
              
              <div className="space-y-2">
                {[1, 2].map(i => (
                  <div key={i} className="h-8 bg-foreground/5 rounded flex items-center px-3">
                    <div className="w-4 h-4 rounded-sm border border-primary/40 mr-3"></div>
                    <div className="w-3/4 h-3 bg-foreground/10 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-muted-foreground text-sm absolute bottom-36 left-0 right-0 text-center">
              Interactive dashboard preview with AI-powered study tools
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPreview; 