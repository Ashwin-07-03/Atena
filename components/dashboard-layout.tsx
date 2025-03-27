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
  Palette
} from 'lucide-react';
import { Logo } from './ui/logo';
import { ThemeSwitcher } from './ui/theme-switcher';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem = ({ href, icon, label }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  // Use the zen-nav-item class from globals.css
  return (
    <Link
      href={href}
      className={cn(
        "zen-nav-item flex items-center gap-3",
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
      <aside className="w-full md:w-64 border-r border-primary/10 bg-background/90 backdrop-blur-sm md:min-h-screen flex flex-col shadow-washi relative overflow-hidden">
        {/* Japanese-inspired decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="40" fill="currentColor" className="text-primary" />
            <path d="M50,10 A40,40 0 0,1 90,50 A40,40 0 0,1 50,90 A40,40 0 0,1 10,50 A40,40 0 0,1 50,10 Z" 
                  fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
          </svg>
        </div>
        
        <div className="absolute bottom-0 left-0 w-24 h-24 opacity-5 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
            <path d="M20,20 L80,20 L80,80 L20,80 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
          </svg>
        </div>

        <div className="p-6 border-b border-primary/10 flex flex-col items-start">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <Cherry size={20} className="text-secondary mr-2 animate-gentle-reveal" />
              <Logo size="md" className="animate-gentle-reveal" />
            </div>
            <ThemeSwitcher />
          </div>
          <p className="text-sm text-muted-foreground mt-2 tracking-wider">
            Study Assistant
          </p>
          <div className="w-16 h-0.5 bg-secondary/50 mt-3 animate-gentle-reveal delay-200" />
        </div>
        
        <nav className="p-6 space-y-4 flex-1">
          <div className="text-xs uppercase tracking-wider text-secondary/80 mb-2">Dashboard</div>
          <NavItem href="/dashboard" icon={<Home size={18} />} label="Home" />
          <NavItem href="/dashboard/study" icon={<Clock size={18} />} label="Study Sessions" />
          <NavItem href="/dashboard/resources" icon={<BookOpen size={18} />} label="Resources" />
          
          <div className="jp-divider my-6 border-primary/10"></div>
          
          <div className="text-xs uppercase tracking-wider text-accent/80 mb-2">Tools</div>
          <NavItem href="/dashboard/flashcards" icon={<FileText size={18} />} label="Flashcards" />
          <NavItem href="/dashboard/schedule" icon={<Calendar size={18} />} label="Schedule" />
          <NavItem href="/dashboard/analytics" icon={<BarChart size={18} />} label="Analytics" />
          <NavItem href="/dashboard/collaborate" icon={<Users size={18} />} label="Collaboration" />
          <NavItem href="/dashboard/chatbot" icon={<MessageSquare size={18} />} label="Study Chatbot" />
          
          <div className="mt-auto">
            <NavItem href="/dashboard/settings" icon={<Settings size={18} />} label="Settings" />
          </div>
        </nav>
        
        {/* Student card section updated with engaging design elements */}
        <div className="p-6 border-t border-primary/10 md:block hidden">
          <div className="p-5 rounded-md bg-gradient-to-br from-primary/5 to-background border border-primary/10 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-washi group">
            <div className="absolute top-0 right-0 w-40 h-40 opacity-10 pointer-events-none transform rotate-12 group-hover:rotate-6 transition-transform duration-700">
              <Flower size={80} className="text-secondary animate-gentle-rotate" style={{animationDuration: "60s"}} />
            </div>
            <div className="absolute bottom-0 left-0 w-20 h-20 opacity-10 pointer-events-none transform -rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <Cherry size={40} className="text-primary" />
            </div>
            <div className="flex items-center space-x-4 relative z-10">
              <div className="w-12 h-12 rounded-md bg-gradient-to-br from-secondary to-secondary/70 shadow-zen flex items-center justify-center text-secondary-foreground font-normal transform group-hover:scale-110 transition-transform duration-300">
                S
              </div>
              <div>
                <p className="text-sm font-medium tracking-wider">Student Name</p>
                <p className="text-xs text-muted-foreground">student@example.com</p>
                <div className="h-0.5 w-0 bg-secondary/30 mt-2 group-hover:w-full transition-all duration-700"></div>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main content with enhanced decorative elements */}
      <main className="flex-1 bg-background min-h-screen p-6 md:p-8 relative overflow-hidden">
        {/* Decorative elements with animations */}
        <div className="absolute top-0 right-0 w-80 h-80 opacity-[0.07] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-gentle-rotate" style={{animationDuration: "120s"}}>
            <circle cx="60" cy="40" r="30" fill="currentColor" className="text-secondary" />
            <circle cx="55" cy="35" r="25" fill="none" stroke="currentColor" className="text-primary" strokeWidth="0.5" />
            <circle cx="50" cy="30" r="20" fill="none" stroke="currentColor" className="text-accent" strokeWidth="0.5" />
          </svg>
        </div>
        
        <div className="absolute bottom-0 left-1/3 w-80 h-80 opacity-[0.07] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-gentle-rotate" style={{animationDuration: "180s", animationDirection: "reverse"}}>
            <rect x="20" y="20" width="60" height="60" fill="currentColor" className="text-accent" />
            <rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" className="text-primary" strokeWidth="0.5" />
            <rect x="30" y="30" width="40" height="40" fill="none" stroke="currentColor" className="text-secondary" strokeWidth="0.5" />
          </svg>
        </div>
        
        <div className="absolute top-1/2 left-1/4 w-48 h-48 opacity-[0.05] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-soft-float" style={{animationDuration: "15s"}}>
            <polygon points="50,10 90,50 50,90 10,50" fill="currentColor" className="text-primary" />
            <polygon points="50,20 80,50 50,80 20,50" fill="none" stroke="currentColor" className="text-secondary" strokeWidth="0.5" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto animate-gentle-reveal">
          {children}
        </div>
      </main>
    </div>
  );
} 