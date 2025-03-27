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
  Sparkles
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

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center py-2.5 px-4 text-sm rounded-xl transition-all duration-200 hover:translate-x-1",
        isActive 
          ? "bg-gradient-to-r from-primary/80 to-primary/40 text-primary-foreground font-medium shadow-sm" 
          : "text-foreground/70 hover:text-foreground hover:bg-primary/10"
      )}
    >
      <div className={cn(
        "mr-3 flex items-center justify-center h-8 w-8 rounded-lg",
        isActive 
          ? "text-primary-foreground" 
          : "text-foreground/60"
      )}>
        {icon}
      </div>
      <span>{label}</span>
    </Link>
  );
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-background to-background/95">
      {/* Sidebar */}
      <aside className="w-full md:w-72 border-r border-primary/10 bg-background/80 backdrop-blur-md md:min-h-screen flex flex-col shadow-md">
        <div className="p-5 border-b border-primary/10 flex flex-col items-center md:items-start">
          <div className="flex items-center space-x-2">
            <Logo size="md" className="animate-soft-bounce" />
            <div className="hidden md:block">
              <h1 className="text-lg font-semibold bg-gradient-to-r from-primary-foreground to-secondary-foreground bg-clip-text text-transparent">
                Atena
              </h1>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1 flex items-center">
            <Sparkles className="h-3.5 w-3.5 mr-1 text-primary" />
            Intelligent Study Assistant
          </p>
        </div>
        
        <nav className="p-4 space-y-2 flex-1">
          <NavItem href="/dashboard" icon={<Home size={18} />} label="Dashboard" />
          <NavItem href="/dashboard/study" icon={<Clock size={18} />} label="Study Sessions" />
          <NavItem href="/dashboard/resources" icon={<BookOpen size={18} />} label="Resources" />
          <NavItem href="/dashboard/flashcards" icon={<FileText size={18} />} label="Flashcards" />
          <NavItem href="/dashboard/schedule" icon={<Calendar size={18} />} label="Schedule" />
          <NavItem href="/dashboard/analytics" icon={<BarChart size={18} />} label="Analytics" />
          <NavItem href="/dashboard/collaborate" icon={<Users size={18} />} label="Collaboration" />
          <NavItem href="/dashboard/chatbot" icon={<MessageSquare size={18} />} label="Study Chatbot" />
          <NavItem href="/dashboard/settings" icon={<Settings size={18} />} label="Settings" />
        </nav>
        
        <div className="p-4 border-t border-primary/10 md:block hidden">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm shadow-sm border border-primary/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary shadow-md flex items-center justify-center text-primary-foreground font-semibold">
                S
              </div>
              <div>
                <p className="text-sm font-medium">Student Name</p>
                <p className="text-xs text-muted-foreground">student@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 bg-background/30 min-h-screen p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
} 