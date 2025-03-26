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
  MessageSquare 
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
        "flex items-center py-2 px-3 text-sm rounded-md transition-colors",
        isActive 
          ? "bg-primary/10 text-primary font-medium" 
          : "text-foreground/70 hover:text-foreground hover:bg-background/80"
      )}
    >
      <div className="mr-3 text-lg">{icon}</div>
      <span>{label}</span>
    </Link>
  );
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-border bg-background md:min-h-screen flex flex-col">
        <div className="p-4 border-b border-border flex flex-col items-center md:items-start">
          <Logo size="md" className="mb-1" />
          <p className="text-sm text-muted-foreground">Intelligent Study Assistant</p>
        </div>
        
        <nav className="p-4 space-y-1 flex-1">
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
        
        <div className="p-4 border-t border-border md:block hidden">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
            <div>
              <p className="text-sm font-medium">Student Name</p>
              <p className="text-xs text-muted-foreground">student@example.com</p>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 bg-muted min-h-screen">
        {children}
      </main>
    </div>
  );
} 