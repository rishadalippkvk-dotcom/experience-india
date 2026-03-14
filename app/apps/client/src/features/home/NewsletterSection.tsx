import { useEffect, useRef, useState } from 'react';
import { Mail, Send, Sparkles } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { toast } from 'sonner';

export function NewsletterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Thank you for subscribing!', {
        description: 'You will receive our latest travel updates.',
      });
      setEmail('');
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="w-full py-24 bg-cream relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full translate-x-1/3 translate-y-1/3" />
      
      {/* Floating Sparkles */}
      {[...Array(6)].map((_, i) => (
        <Sparkles
          key={i}
          className="absolute text-gold/20 animate-float"
          style={{
            top: `${15 + i * 15}%`,
            right: `${5 + i * 8}%`,
            animationDelay: `${i * 0.5}s`,
            width: `${16 + i * 4}px`,
            height: `${16 + i * 4}px`,
          }}
        />
      ))}

      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 relative z-10">
        <div 
          className={`max-w-3xl mx-auto text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Icon */}
          <div 
            className={`w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
          >
            <Mail className="w-8 h-8 text-gold" />
          </div>

          {/* Heading */}
          <h2 className="font-display text-4xl sm:text-5xl text-text-primary font-semibold mb-4">
            Travel Stories in Your Inbox
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
            Subscribe to our newsletter for exclusive travel guides, hidden gems, 
            and insider tips about India's most fascinating destinations.
          </p>

          {/* Form */}
          <form 
            onSubmit={handleSubmit}
            className={`flex flex-col sm:flex-row gap-4 max-w-lg mx-auto transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary/50" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-6 rounded-xl border-border focus:border-gold focus:ring-gold/20 text-base"
                required
              />
            </div>
            <Button
              type="submit"
              className="bg-gold hover:bg-gold-hover text-white font-semibold px-8 py-6 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-gold group"
            >
              Subscribe
              <Send className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </form>

          {/* Trust Text */}
          <p 
            className={`text-text-secondary/60 text-sm mt-4 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Join 10,000+ travelers. No spam, unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
