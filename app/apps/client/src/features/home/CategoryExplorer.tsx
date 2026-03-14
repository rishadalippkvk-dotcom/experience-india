import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, History, Ghost, UtensilsCrossed, Home } from 'lucide-react';
import type { Destination, Category } from '@/shared/types';

const iconMap: Record<string, React.ElementType> = {
  history: History,
  mystery: Ghost,
  food: UtensilsCrossed,
  hostels: Home,
};

export function CategoryExplorer() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/destinations');
        if (response.ok) {
          const destinations: Destination[] = await response.json();
          // Build categories dynamically from destinations
          const categoryMap: Record<string, number> = {};
          destinations.forEach((d) => {
            categoryMap[d.category] = (categoryMap[d.category] || 0) + 1;
          });

          const categoryMeta: Record<string, { name: string; description: string; image: string }> = {
            history: { name: 'History', description: 'Journey Through Time', image: '/history-hampi.jpg' },
            mystery: { name: 'Mystery', description: 'Uncover the Unknown', image: '/mystery-bhangarh.jpg' },
            food: { name: 'Food', description: 'Taste the Culture', image: '/food-street.jpg' },
            hostels: { name: 'Hostels', description: 'Stay with Locals', image: '/hostel-interior.jpg' },
            nature: { name: 'Nature', description: 'Explore the Wild', image: '/kerala.jpg' },
          };

          const builtCategories: Category[] = Object.entries(categoryMap).map(([id, count]) => ({
            id,
            name: categoryMeta[id]?.name || id.charAt(0).toUpperCase() + id.slice(1),
            description: categoryMeta[id]?.description || 'Explore destinations',
            image: categoryMeta[id]?.image || '/hero-bg.jpg',
            count,
          }));

          setCategories(builtCategories);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();

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

  return (
    <section 
      ref={sectionRef}
      className="w-full py-24 bg-beige"
    >
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 
            className={`font-display text-4xl sm:text-5xl text-text-primary font-semibold mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Explore by Category
          </h2>
          <div 
            className={`w-24 h-1 bg-gold mx-auto rounded-full transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            }`}
          />
          <p 
            className={`text-text-secondary text-lg mt-4 max-w-xl mx-auto transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Find your perfect adventure through our curated categories
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, index) => {
            const Icon = iconMap[category.id] || ArrowRight;
            return (
              <Link
                key={category.id}
                to="/destinations"
                className={`group cursor-pointer relative overflow-hidden rounded-2xl transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                {/* Background Image */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gold/90 flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:bg-gold">
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Text */}
                  <h3 className="font-display text-3xl text-white font-semibold mb-2">
                    {category.name}
                  </h3>
                  <p className="text-white/80 text-lg mb-2">{category.description}</p>
                  <p className="text-gold text-sm font-medium">{category.count} destinations</p>

                  {/* Hover Arrow */}
                  <div className="absolute bottom-8 right-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center opacity-0 translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-gold">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Border Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent transition-all duration-500 group-hover:border-gold/50" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
