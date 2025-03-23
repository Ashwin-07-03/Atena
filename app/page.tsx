import Link from 'next/link';
import { Metadata } from 'next';
import EnhancedHero from '@/components/hero/enhanced-hero';

export const metadata: Metadata = {
  title: 'Atena - Intelligent Study Management',
  description: 'AI-powered study management tailored to your learning style.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <EnhancedHero />
      
      <section className="py-20 px-4 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Experience the Dashboard
        </h2>
        <p className="text-lg mb-10 max-w-2xl mx-auto text-foreground/70">
          Explore our AI-powered dashboard with smart study tools, including an intelligent Pomodoro timer that adapts to your learning style.
        </p>
        <Link 
          href="/dashboard" 
          className="btn-primary inline-block py-3 px-8"
        >
          View Dashboard
        </Link>
      </section>
    </main>
  );
} 