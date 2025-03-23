"use client"

import Link from 'next/link'

export default function AuthTestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold mb-6">Auth Test Links</h1>
      
      <div className="flex flex-col gap-2 w-full max-w-xs">
        <Link 
          href="/login" 
          className="bg-primary text-primary-foreground px-6 py-3 rounded text-center hover:bg-primary/90"
        >
          Login Page
        </Link>
        
        <Link 
          href="/register" 
          className="bg-primary text-primary-foreground px-6 py-3 rounded text-center hover:bg-primary/90"
        >
          Register Page
        </Link>
        
        <Link 
          href="/dashboard" 
          className="bg-secondary text-secondary-foreground px-6 py-3 rounded text-center hover:bg-secondary/90"
        >
          Dashboard
        </Link>
        
        <Link 
          href="/" 
          className="border border-input px-6 py-3 rounded text-center hover:bg-accent/50"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
} 