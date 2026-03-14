import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import type { Destination } from '@/shared/types';

export function FeaturedDestinations() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('/api/destinations');
        if (response.ok) {
          const data = await response.json();
          // Sort by rating (desc) and take top 3
          const topRated = data
            .sort((a: Destination, b: Destination) => b.rating - a.rating)
            .slice(0, 3);
          setDestinations(topRated);
        }
      } catch (error) {
        console.error('Failed to fetch destinations');
      }
    };

    fetchDestinations();

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

  const rotations = [-2, 0, 2];

  return (
    <section
      ref={sectionRef}
      className="w-full py-24 bg-cream"
    >
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className={`font-display text-4xl sm:text-5xl text-text-primary font-semibold mb-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            Featured Destinations
          </h2>
          <div
            className={`w-24 h-1 bg-gold mx-auto rounded-full transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
              }`}
          />
          <p
            className={`text-text-secondary text-lg mt-4 max-w-xl mx-auto transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            Handpicked places that capture India's essence
          </p>
        </div>

        {/* Destination Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <Link
              key={destination.id}
              to={`/destination/${destination._id}`}
              className={`group cursor-pointer transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                }`}
              style={{
                transitionDelay: `${300 + index * 150}ms`,
                transform: isVisible ? `rotate(${rotations[index]}deg)` : 'rotate(0deg) translateY(64px)',
              }}
            >
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-soft transition-all duration-500 group-hover:shadow-lift group-hover:-translate-y-3 group-hover:rotate-0">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full">
                    <Star className="w-4 h-4 fill-star text-star" />
                    <span className="text-sm font-semibold text-text-primary">{destination.rating}</span>
                  </div>

                  {/* Location Badge */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">{destination.location}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display text-2xl text-text-primary font-semibold mb-2 group-hover:text-gold transition-colors duration-300">
                    {destination.name}
                  </h3>
                  <p className="text-gold font-medium text-sm mb-3">{destination.tagline}</p>
                  <p className="text-text-secondary text-sm leading-relaxed line-clamp-2 mb-4">
                    {destination.description}
                  </p>

                  {/* Explore Button */}
                  <div className="flex items-center gap-2 text-gold font-medium text-sm opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div
          className={`text-center mt-12 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          <Link
            to="/destinations"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-text-primary text-text-primary font-medium rounded-xl hover:bg-text-primary hover:text-white transition-all duration-300 group"
          >
            View All Destinations
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
