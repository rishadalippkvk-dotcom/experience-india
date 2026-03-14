import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current || !contentRef.current) return;

      const scrollY = window.scrollY;
      const heroHeight = heroRef.current.offsetHeight;
      const progress = Math.min(scrollY / heroHeight, 1);

      // Parallax effect on image
      const img = heroRef.current.querySelector('img');
      if (img) {
        img.style.transform = `scale(${1 + progress * 0.15}) translateY(${-progress * 100}px)`;
      }

      // Fade out content
      contentRef.current.style.opacity = `${1 - progress * 1.5}`;
      contentRef.current.style.transform = `translateY(${-progress * 50}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/hero-bg.jpg"
          alt="Indian street scene"
          className="w-full h-full object-cover transition-transform duration-100"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gold/30 animate-float"
            style={{
              left: `${10 + i * 12}%`,
              bottom: `${10 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${6 + i * 1.5}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 min-h-screen flex items-center"
      >
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 py-32">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 animate-fade-in-up">
              <Compass className="w-4 h-4 text-gold" />
              <span className="text-white/90 text-sm font-medium">Discover Incredible India</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white font-semibold leading-tight mb-6">
              <span className="block animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                Discover the
              </span>
              <span className="block animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                Stories of{' '}
                <span className="text-gold">India</span>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-white/80 font-body leading-relaxed mb-10 max-w-xl animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              Explore culture, history, mystery, and local life across incredible destinations.
              Your journey through the heart of India begins here.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <Link to="/destinations">
                <Button
                  size="lg"
                  className="bg-gold hover:bg-gold-hover text-white font-semibold px-8 py-6 text-base rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-gold group"
                >
                  Explore Destinations
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/destinations">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gold/60 text-gold hover:bg-gold/10 hover:border-gold font-semibold px-8 py-6 text-base rounded-xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
                >
                  Start Your Journey
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-16 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
              <div>
                <div className="font-display text-3xl text-gold font-bold">50+</div>
                <div className="text-white/70 text-sm">Destinations</div>
              </div>
              <div>
                <div className="font-display text-3xl text-gold font-bold">10K+</div>
                <div className="text-white/70 text-sm">Happy Travelers</div>
              </div>
              <div>
                <div className="font-display text-3xl text-gold font-bold">4.9</div>
                <div className="text-white/70 text-sm">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-white/60 text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-gold animate-pulse" />
        </div>
      </div>
    </section>
  );
}
