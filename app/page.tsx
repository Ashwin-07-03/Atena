import Link from 'next/link';
import { Metadata } from 'next';
import EnhancedHero from '@/components/hero/enhanced-hero';
import { Grape, Brain, BookOpen, ArrowRight, LineChart, CheckCircle, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Atena - Intelligent Study Management',
  description: 'AI-powered study management tailored to your learning style.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <EnhancedHero />
      
      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative inline-block">
              <span className="relative z-10">Why Students Love Atena</span>
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0"></div>
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
              Our AI-powered platform adapts to your unique learning style, making study sessions more effective and enjoyable.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-8 backdrop-blur-md">
              <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-juice">
                <Brain className="text-primary w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Learning Assistant</h3>
              <p className="text-muted-foreground">
                Personalized study plans that adapt to your progress and learning pace, optimizing your study sessions.
              </p>
              <ul className="mt-4 space-y-2">
                {['Smart scheduling', 'Retention optimization', 'Customized resources'].map((item) => (
                  <li key={item} className="flex items-center text-sm">
                    <CheckCircle className="text-primary w-4 h-4 mr-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Feature 2 */}
            <div className="card p-8 backdrop-blur-md">
              <div className="bg-accent/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-juice">
                <LineChart className="text-accent w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Progress Analytics</h3>
              <p className="text-muted-foreground">
                Track your learning progress with detailed analytics and insights to identify strengths and weaknesses.
              </p>
              <ul className="mt-4 space-y-2">
                {['Grade predictions', 'Progress visualization', 'Comparative analysis'].map((item) => (
                  <li key={item} className="flex items-center text-sm">
                    <CheckCircle className="text-accent w-4 h-4 mr-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Feature 3 */}
            <div className="card p-8 backdrop-blur-md">
              <div className="bg-secondary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-juice">
                <Calendar className="text-secondary w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Scheduling</h3>
              <p className="text-muted-foreground">
                Intelligent calendar that balances your academic workload with personal commitments for optimal results.
              </p>
              <ul className="mt-4 space-y-2">
                {['Deadline management', 'Spaced repetition', 'Study-life balance'].map((item) => (
                  <li key={item} className="flex items-center text-sm">
                    <CheckCircle className="text-secondary w-4 h-4 mr-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl -z-10"></div>
      </section>
      
      {/* Dashboard Preview Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative inline-block">
            <span className="relative z-10">Experience the Dashboard</span>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-accent/0 via-accent/50 to-accent/0"></div>
          </h2>
          <p className="text-lg mb-10 max-w-2xl mx-auto text-muted-foreground">
            Explore our AI-powered dashboard with smart study tools, including an intelligent Pomodoro timer that adapts to your learning style.
          </p>
          <div className="relative rounded-xl overflow-hidden shadow-juice border border-primary/15 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 pointer-events-none z-10"></div>
            <img 
              src="/dashboard-preview.png" 
              alt="Atena Dashboard Preview" 
              className="w-full rounded-xl"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = 'none';
                const fallbackEl = target.parentElement?.querySelector('div[data-fallback="true"]');
                if (fallbackEl) {
                  (fallbackEl as HTMLDivElement).style.display = 'flex';
                }
              }}
            />
            <div 
              data-fallback="true"
              className="hidden w-full h-[400px] items-center justify-center bg-primary/5 rounded-xl" 
            >
              <p className="text-muted-foreground">Dashboard Preview Image</p>
            </div>
          </div>
          <Link 
            href="/dashboard" 
            className="btn-primary inline-flex mt-10 py-3 px-8 items-center gap-2 group"
          >
            <span>View Dashboard</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative inline-block">
              <span className="relative z-10">What Our Users Say</span>
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-secondary/0 via-secondary/50 to-secondary/0"></div>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Emma C.",
                role: "Medical Student",
                quote: "Atena's AI scheduling helped me balance my clinical rotations with study time. My exam scores improved by 15% in just one semester!"
              },
              {
                name: "James L.",
                role: "Computer Science Major",
                quote: "The personalized learning paths are game-changing. Atena identified my knowledge gaps and created focused practice sessions that really worked."
              },
              {
                name: "Sophia K.",
                role: "Law Student",
                quote: "I was struggling with time management until I found Atena. Now I can track my progress, manage deadlines, and actually have free time!"
              }
            ].map((testimonial, index) => (
              <div key={index} className="card p-8 backdrop-blur-md">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-foreground italic mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center card p-12 bg-gradient-to-r from-primary/10 to-accent/10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Study Experience?</h2>
          <p className="text-lg mb-10 max-w-2xl mx-auto text-muted-foreground">
            Join thousands of students who have already improved their grades and reduced study stress with Atena.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register" 
              className="px-8 py-4 rounded-xl bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-juice font-medium flex items-center justify-center gap-2 border border-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-juice"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/dashboard" 
              className="px-8 py-4 rounded-xl bg-accent/10 text-foreground border border-accent/20 flex items-center justify-center gap-2 shadow-juice transition-all duration-300 hover:scale-105 hover:shadow-juice hover:bg-accent/20"
            >
              <span>View Demo</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
} 