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
          <div className="w-16 h-0.5 bg-sky/20 mt-3 animate-gentle-reveal delay-200" />
        </div>
        
        <nav className="p-6 space-y-4 flex-1">
          <div className="text-xs uppercase tracking-wider text-foreground/40 mb-2">Dashboard</div>
          <NavItem href="/dashboard" icon={<Home size={18} />} label="Home" />
          <NavItem href="/dashboard/study" icon={<Clock size={18} />} label="Study Sessions" />
          <NavItem href="/dashboard/resources" icon={<BookOpen size={18} />} label="Resources" />
          
          <div className="jp-divider my-6 border-primary/10"></div>
          
          <div className="text-xs uppercase tracking-wider text-foreground/40 mb-2">Tools</div>
          <NavItem href="/dashboard/flashcards" icon={<FileText size={18} />} label="Flashcards" />
          <NavItem href="/dashboard/schedule" icon={<Calendar size={18} />} label="Schedule" />
          <NavItem href="/dashboard/analytics" icon={<BarChart size={18} />} label="Analytics" />
          <NavItem href="/dashboard/collaborate" icon={<Users size={18} />} label="Collaboration" />
          <NavItem href="/dashboard/chatbot" icon={<MessageSquare size={18} />} label="Study Chatbot" />
          
          <div className="mt-auto">
            <NavItem href="/dashboard/settings" icon={<Settings size={18} />} label="Settings" />
          </div>
        </nav>
        
        <div className="p-6 border-t border-primary/10 md:block hidden">
          <div className="p-4 rounded-sm bg-primary/10 border border-primary/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
              <Flower size={64} className="text-primary" />
            </div>
            <div className="flex items-center space-x-3 relative z-10">
              <div className="w-10 h-10 rounded-sm bg-secondary shadow-washi flex items-center justify-center text-secondary-foreground font-normal">
                S
              </div>
              <div>
                <p className="text-sm font-medium tracking-wider">Student Name</p>
                <p className="text-xs text-muted-foreground">student@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 bg-background min-h-screen p-6 md:p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.015] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="60" cy="40" r="30" fill="currentColor" className="text-primary" />
          </svg>
        </div>
        
        <div className="absolute bottom-0 left-1/3 w-64 h-64 opacity-[0.015] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect x="20" y="20" width="60" height="60" fill="currentColor" className="text-primary" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto animate-gentle-reveal">
          {children}
        </div>
      </main>
    </div>
  );
} 