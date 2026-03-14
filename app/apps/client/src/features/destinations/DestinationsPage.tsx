import { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, MapPin, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { destinations } from '@/shared/data/destinations';

type FilterCategory = 'all' | 'history' | 'mystery' | 'food' | 'hostels' | 'nature' | 'top-rated';

export function DestinationsPage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const filteredDestinations = useMemo(() => {
    let result = destinations;

    // Apply category filter
    if (activeFilter !== 'all') {
      if (activeFilter === 'top-rated') {
        result = result.filter(d => d.rating >= 4.7);
      } else {
        result = result.filter(d => d.category === activeFilter);
      }
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        d =>
          d.name.toLowerCase().includes(query) ||
          d.tagline.toLowerCase().includes(query) ||
          d.location.toLowerCase().includes(query)
      );
    }

    return result;
  }, [activeFilter, searchQuery]);

  const filterButtons: { label: string; value: FilterCategory }[] = [
    { label: 'All', value: 'all' },
    { label: 'History', value: 'history' },
    { label: 'Nature', value: 'nature' },
    { label: 'Mystery', value: 'mystery' },
    { label: 'Top Rated', value: 'top-rated' },
  ];

  return (
    <section ref={sectionRef} className="w-full min-h-screen bg-cream pt-24 pb-24">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 
            className={`font-display text-4xl sm:text-5xl text-text-primary font-semibold mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            All Destinations
          </h1>
          <p 
            className={`text-text-secondary text-lg max-w-xl mx-auto transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Discover India's most captivating places, from ancient forts to serene beaches
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div 
          className={`flex flex-col md:flex-row gap-4 mb-10 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary/50" />
            <Input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-6 rounded-xl border-border focus:border-gold focus:ring-gold/20 text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary/50 hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filter Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {filterButtons.map((filter) => (
              <Button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                variant={activeFilter === filter.value ? 'default' : 'outline'}
                className={`rounded-full px-5 py-2 transition-all duration-300 ${
                  activeFilter === filter.value
                    ? 'bg-gold hover:bg-gold-hover text-white'
                    : 'border-border text-text-secondary hover:border-gold hover:text-gold'
                }`}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          {/* Mobile Filter Button */}
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden rounded-xl border-border"
          >
            <SlidersHorizontal className="w-5 h-5 mr-2" />
            Filters
          </Button>
        </div>

        {/* Mobile Filter Dropdown */}
        {isFilterOpen && (
          <div className="md:hidden flex flex-wrap gap-2 mb-6 animate-fade-in-up">
            {filterButtons.map((filter) => (
              <Button
                key={filter.value}
                onClick={() => {
                  setActiveFilter(filter.value);
                  setIsFilterOpen(false);
                }}
                variant={activeFilter === filter.value ? 'default' : 'outline'}
                size="sm"
                className={`rounded-full transition-all duration-300 ${
                  activeFilter === filter.value
                    ? 'bg-gold hover:bg-gold-hover text-white'
                    : 'border-border text-text-secondary'
                }`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6 text-text-secondary text-sm">
          Showing {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''}
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((destination, index) => (
            <Link
              key={destination.id}
              to={`/destination/${destination.id}`}
              className={`group cursor-pointer transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${300 + index * 80}ms` }}
            >
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-soft transition-all duration-500 group-hover:shadow-lift group-hover:-translate-y-2">
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                    <Star className="w-3.5 h-3.5 fill-star text-star" />
                    <span className="text-xs font-semibold text-text-primary">{destination.rating}</span>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 bg-gold/90 backdrop-blur-sm rounded-full">
                    <span className="text-xs font-medium text-white capitalize">{destination.category}</span>
                  </div>

                  {/* Location */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">{destination.location}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-display text-xl text-text-primary font-semibold mb-1 group-hover:text-gold transition-colors duration-300">
                    {destination.name}
                  </h3>
                  <p className="text-gold text-sm font-medium mb-2">{destination.tagline}</p>
                  <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">
                    {destination.description}
                  </p>
                  
                  {/* Meta Info */}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                    <div className="text-xs text-text-secondary">
                      <span className="font-medium">{destination.reviewCount}</span> reviews
                    </div>
                    <div className="text-xs text-text-secondary">
                      <span className="font-medium">{destination.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredDestinations.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-beige flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-text-secondary/50" />
            </div>
            <h3 className="font-display text-2xl text-text-primary font-semibold mb-2">
              No destinations found
            </h3>
            <p className="text-text-secondary">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
