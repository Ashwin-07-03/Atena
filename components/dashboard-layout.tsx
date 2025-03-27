"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Home, 
  Settings, 
  FileText, 
  Users, 
  BarChart,
  MessageSquare,
  Cherry,
  Flower,
  Grape
} from 'lucide-react';
import { Logo } from './ui/logo';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem = ({ href, icon, label }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  // Use the fruit-nav-item class from globals.css
  return (
    <Link
      href={href}
      className={cn(
        "fruit-nav-item flex items-center gap-3",
        isActive && "active"
      )}
    >
      <span className={cn(
        "text-lg transition-all duration-500",
        isActive ? "text-primary" : "text-foreground/60"
      )}>
        {icon}
      </span>
      <span className="tracking-wider">{label}</span>
    </Link>
  );
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-primary/10 bg-background/90 backdrop-blur-sm md:min-h-screen flex flex-col shadow-juice relative overflow-hidden">
        {/* Fruit-inspired decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 opacity-5 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-gentle-rotate" style={{animationDuration: '90s'}}>
            <circle cx="50" cy="50" r="40" fill="currentColor" className="text-primary" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" className="text-secondary" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" className="text-accent" />
          </svg>
        </div>
        
        <div className="absolute bottom-0 left-0 w-32 h-32 opacity-5 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-gentle-rotate" style={{animationDuration: '120s', animationDirection: 'reverse'}}>
            <rect x="10" y="10" width="80" height="80" rx="10" ry="10" fill="currentColor" className="text-accent" />
            <rect x="20" y="20" width="60" height="60" rx="8" ry="8" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary" />
            <rect x="30" y="30" width="40" height="40" rx="6" ry="6" fill="none" stroke="currentColor" strokeWidth="1" className="text-secondary" />
          </svg>
        </div>

        <div className="p-6 border-b border-primary/10 flex flex-col items-start">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <Grape size={20} className="text-primary mr-2 animate-wiggle" />
              <Logo size="md" className="animate-gentle-reveal" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2 tracking-wider">
            Study Assistant
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10 mt-3 rounded-full animate-gentle-reveal delay-200" />
        </div>
        
        <nav className="p-6 space-y-4 flex-1">
          <div className="text-xs uppercase tracking-wider text-primary/80 mb-2 ml-1">Dashboard</div>
          <NavItem href="/dashboard" icon={<Home size={18} />} label="Home" />
          <NavItem href="/dashboard/study" icon={<Clock size={18} />} label="Study Sessions" />
          <NavItem href="/dashboard/resources" icon={<BookOpen size={18} />} label="Resources" />
          
          <div className="fruit-slice-divider my-6"></div>
          
          <div className="text-xs uppercase tracking-wider text-accent/80 mb-2 ml-1">Tools</div>
          <NavItem href="/dashboard/flashcards" icon={<FileText size={18} />} label="Flashcards" />
          <NavItem href="/dashboard/schedule" icon={<Calendar size={18} />} label="Schedule" />
          <NavItem href="/dashboard/analytics" icon={<BarChart size={18} />} label="Analytics" />
          <NavItem href="/dashboard/collaborate" icon={<Users size={18} />} label="Collaboration" />
          <NavItem href="/dashboard/chatbot" icon={<MessageSquare size={18} />} label="Study Chatbot" />
          
          <div className="fruit-slice-divider my-6"></div>

          <NavItem href="/dashboard/settings" icon={<Settings size={18} />} label="Settings" />
        </nav>
        
        {/* Student card section updated with engaging design elements */}
        <div className="p-6 border-t border-primary/10 md:block hidden">
          <div className="p-5 rounded-xl bg-gradient-to-br from-primary/5 to-background border border-primary/10 relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-juice group">
            <div className="absolute top-0 right-0 w-40 h-40 opacity-10 pointer-events-none transform rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <svg viewBox="0 0 100 100" className="w-full h-full animate-gentle-rotate" style={{animationDuration: '60s'}}>
                <circle cx="50" cy="50" r="40" fill="currentColor" className="text-secondary" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary" />
                <path d="M50,20 Q70,50 50,80 Q30,50 50,20" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
              </svg>
            </div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 opacity-10 pointer-events-none transform -rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect x="20" y="20" width="60" height="60" rx="10" ry="10" fill="currentColor" className="text-primary" />
              </svg>
            </div>
            <div className="flex items-center space-x-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/90 via-primary to-primary/70 shadow-juice flex items-center justify-center text-primary-foreground font-medium transform group-hover:scale-110 transition-transform duration-300 animate-pulse-juice">
                S
              </div>
              <div>
                <p className="text-sm font-medium tracking-wider">Student Name</p>
                <p className="text-xs text-muted-foreground">student@example.com</p>
                <div className="h-0.5 w-0 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 mt-2 group-hover:w-full transition-all duration-700 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main content with enhanced decorative elements */}
      <main className="flex-1 bg-background min-h-screen p-6 md:p-8 relative overflow-hidden">
        {/* Decorative elements with animations */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.05] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-gentle-rotate" style={{animationDuration: '120s'}}>
            <circle cx="60" cy="40" r="30" fill="currentColor" className="text-secondary" />
            <circle cx="60" cy="40" r="20" fill="none" stroke="currentColor" className="text-primary" strokeWidth="0.5" />
            <path d="M40,20 C60,40 80,40 60,70" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary" />
          </svg>
        </div>
        
        <div className="absolute bottom-0 left-1/3 w-96 h-96 opacity-[0.05] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-gentle-rotate" style={{animationDuration: '180s', animationDirection: 'reverse'}}>
            <rect x="20" y="20" width="60" height="60" rx="10" ry="10" fill="currentColor" className="text-accent" />
            <rect x="30" y="30" width="40" height="40" rx="8" ry="8" fill="none" stroke="currentColor" className="text-primary" strokeWidth="0.5" />
            <path d="M20,50 Q50,20 80,50 Q50,80 20,50" fill="none" stroke="currentColor" strokeWidth="1" className="text-secondary" />
          </svg>
        </div>
        
        <div className="absolute top-1/3 left-1/4 w-64 h-64 opacity-[0.04] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-float-bubble" style={{animationDuration: '15s'}}>
            <path d="M30,20 Q50,10 70,20 Q90,40 70,60 Q50,70 30,60 Q10,40 30,20" fill="currentColor" className="text-primary" />
            <path d="M40,30 Q50,20 60,30 Q70,40 60,50 Q50,60 40,50 Q30,40 40,30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-secondary" />
          </svg>
        </div>
        
        <div className="absolute top-2/3 right-1/4 w-40 h-40 opacity-[0.04] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-pulse-juice" style={{animationDuration: '8s'}}>
            <circle cx="50" cy="50" r="30" fill="currentColor" className="text-accent" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary" />
            <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-secondary" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto animate-gentle-reveal">
          {children}
        </div>
      </main>
    </div>
  );
} 