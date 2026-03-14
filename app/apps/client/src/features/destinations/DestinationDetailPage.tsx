import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Star, MapPin, Clock, Calendar, 
  History, Ghost, UtensilsCrossed, Home, MessageSquare,
  Send, User, Loader2
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { toast } from 'sonner';
import type { Destination, Review } from '@/shared/types';

export function DestinationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ author: '', rating: 0, content: '' });
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await fetch(`/api/destinations/${id}`);
        if (response.ok) {
          const data = await response.json();
          setDestination(data);
          const approvedReviews = (data.reviews || []).filter((r: Review) => r.approved);
          setReviews(approvedReviews);
        }
      } catch (error) {
        console.error('Failed to fetch destination:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestination();
    setIsVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-cream pt-32 pb-24 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="w-full min-h-screen bg-cream pt-32 pb-24 text-center">
        <h1 className="font-display text-3xl text-text-primary mb-4">Destination not found</h1>
        <Link to="/destinations">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Destinations
          </Button>
        </Link>
      </div>
    );
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.author && newReview.rating && newReview.content) {
      try {
        const response = await fetch(`/api/destinations/${destination._id}/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            author: newReview.author,
            rating: newReview.rating,
            date: new Date().toISOString().split('T')[0],
            content: newReview.content,
          }),
        });

        if (response.ok) {
          const updatedDest = await response.json();
          const approvedReviews = (updatedDest.reviews || []).filter((r: Review) => r.approved);
          setReviews(approvedReviews);
          setNewReview({ author: '', rating: 0, content: '' });
          toast.success('Review submitted successfully! It will appear once approved by an admin.');
        } else {
          toast.error('Failed to submit review');
        }
      } catch (error) {
        toast.error('Error submitting review');
      }
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: MapPin },
    { id: 'history', label: 'History', icon: History },
    { id: 'mystery', label: 'Mystery', icon: Ghost },
    { id: 'gallery', label: 'Gallery', icon: null },
    { id: 'food', label: 'Food', icon: UtensilsCrossed },
    { id: 'hostels', label: 'Hostels', icon: Home },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
  ];

  return (
    <div className="w-full min-h-screen bg-cream">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className={`w-full h-full object-cover transition-all duration-1000 ${
            isVisible ? 'scale-100' : 'scale-110'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Back Button */}
        <Link
          to="/destinations"
          className="absolute top-24 left-4 sm:left-8 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </Link>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 lg:p-12">
          <div className="max-w-4xl">
            <div 
              className={`flex items-center gap-2 mb-4 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <span className="px-3 py-1 bg-gold rounded-full text-white text-sm font-medium capitalize">
                {destination.category}
              </span>
              <div className="flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                <Star className="w-4 h-4 fill-star text-star" />
                <span className="text-white text-sm font-medium">{destination.rating}</span>
                <span className="text-white/70 text-sm">({destination.reviewCount} reviews)</span>
              </div>
            </div>
            
            <h1 
              className={`font-display text-5xl sm:text-6xl lg:text-7xl text-white font-semibold mb-4 transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {destination.name}
            </h1>
            <p 
              className={`text-gold text-xl font-medium mb-4 transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {destination.tagline}
            </p>
            
            <div 
              className={`flex flex-wrap items-center gap-6 text-white/80 transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{destination.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>Best time: {destination.bestTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{destination.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Navigation */}
      <div className="sticky top-16 z-40 bg-cream/95 backdrop-blur-sm border-b border-border">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
          <nav className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-gold text-white'
                    : 'text-text-secondary hover:text-text-primary hover:bg-beige'
                }`}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Sections */}
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Overview */}
          <section id="overview" className="mb-16">
            <h2 className="font-display text-3xl text-text-primary font-semibold mb-6">Overview</h2>
            <p className="text-text-secondary text-lg leading-relaxed">{destination.description}</p>
          </section>

          {/* History */}
          {destination.history && (
            <section id="history" className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  <History className="w-5 h-5 text-gold" />
                </div>
                <h2 className="font-display text-3xl text-text-primary font-semibold">History</h2>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-soft">
                <p className="text-text-secondary text-lg leading-relaxed">{destination.history}</p>
              </div>
            </section>
          )}

          {/* Mystery */}
          {destination.mystery && (
            <section id="mystery" className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Ghost className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="font-display text-3xl text-text-primary font-semibold">Mystery & Legends</h2>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
                <p className="text-text-secondary text-lg leading-relaxed">{destination.mystery}</p>
              </div>
            </section>
          )}

          {/* Gallery */}
          {destination.gallery && destination.gallery.length > 0 && (
            <section id="gallery" className="mb-16">
              <h2 className="font-display text-3xl text-text-primary font-semibold mb-6">Photo Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {destination.gallery.map((image, index) => (
                  <div 
                    key={index} 
                    className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                  >
                    <img
                      src={image}
                      alt={`${destination.name} gallery ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Food Spots */}
          {destination.foodSpots && destination.foodSpots.length > 0 && (
            <section id="food" className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="font-display text-3xl text-text-primary font-semibold">Nearby Food Spots</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {destination.foodSpots.map((spot) => (
                  <div key={spot._id || spot.id} className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                    <div className="h-40 overflow-hidden">
                      <img src={spot.image} alt={spot.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-display text-lg font-semibold text-text-primary">{spot.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-star text-star" />
                          <span className="text-sm font-medium">{spot.rating}</span>
                        </div>
                      </div>
                      <p className="text-gold text-sm font-medium mb-2">{spot.cuisine} • {spot.priceRange}</p>
                      <p className="text-text-secondary text-sm">{spot.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Hostels */}
          {destination.hostels && destination.hostels.length > 0 && (
            <section id="hostels" className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Home className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="font-display text-3xl text-text-primary font-semibold">Where to Stay</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {destination.hostels.map((hostel) => (
                  <div key={hostel._id || hostel.id} className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                    <div className="h-40 overflow-hidden">
                      <img src={hostel.image} alt={hostel.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-display text-lg font-semibold text-text-primary">{hostel.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-star text-star" />
                          <span className="text-sm font-medium">{hostel.rating}</span>
                        </div>
                      </div>
                      <p className="text-gold text-sm font-medium mb-2">{hostel.priceRange} per night</p>
                      <p className="text-text-secondary text-sm mb-3">{hostel.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {hostel.amenities.map((amenity, i) => (
                          <span key={i} className="px-2 py-1 bg-beige rounded text-xs text-text-secondary">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reviews Section */}
          <section id="reviews" className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="font-display text-3xl text-text-primary font-semibold">Reviews</h2>
            </div>

            {/* Review Form */}
            <div className="bg-white rounded-2xl p-6 shadow-soft mb-8">
              <h3 className="font-display text-xl font-semibold text-text-primary mb-4">Write a Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Your name"
                    value={newReview.author}
                    onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                    className="rounded-xl"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-text-secondary text-sm">Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          className="transition-transform duration-200 hover:scale-110"
                        >
                          <Star
                            className={`w-6 h-6 transition-colors duration-200 ${
                              star <= (hoveredStar || newReview.rating)
                                ? 'fill-star text-star'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <Textarea
                  placeholder="Share your experience..."
                  value={newReview.content}
                  onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                  className="rounded-xl min-h-[100px]"
                />
                <Button 
                  type="submit" 
                  className="bg-gold hover:bg-gold-hover text-white rounded-xl"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Review
                </Button>
              </form>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id || review.id} className="bg-white rounded-2xl p-6 shadow-soft">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-beige flex items-center justify-center">
                          <User className="w-5 h-5 text-text-secondary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-text-primary">{review.author}</h4>
                          <p className="text-text-secondary text-sm">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 bg-beige rounded-full">
                        <Star className="w-4 h-4 fill-star text-star" />
                        <span className="text-sm font-medium">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-text-secondary leading-relaxed">{review.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl shadow-soft">
                  <MessageSquare className="w-12 h-12 text-text-secondary/30 mx-auto mb-3" />
                  <p className="text-text-secondary">No reviews yet. Be the first to share your experience!</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
