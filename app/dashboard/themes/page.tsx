"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ThemesPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to dashboard since themes are now embedded in the design
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center animate-pulse-soft">
        <p>Redirecting to dashboard...</p>
      </div>
    </div>
  );
} 