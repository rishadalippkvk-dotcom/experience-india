import { useEffect, useRef, useState } from 'react';
import { Quote, Star, User, Send, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { toast } from 'sonner';
import type { Review, Destination } from '@/shared/types';

interface ExtendedReview extends Review {
  destinationId?: string;
  destinationName?: string;
}

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reviews, setReviews] = useState<ExtendedReview[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  
  // Review Form State
  const [showForm, setShowForm] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [newReview, setNewReview] = useState({
    destinationId: '',
    author: '',
    rating: 0,
    content: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Top Reviews
        const reviewsRes = await fetch('/api/destinations/reviews/all?approved=true&rating=5');
        if (reviewsRes.ok) {
          const data = await reviewsRes.json();
          const shuffled = data.sort(() => 0.5 - Math.random());
          setReviews(shuffled);
        }

        // Fetch Destinations for the dropdown
        const destRes = await fetch('/api/destinations');
        if (destRes.ok) {
          const destData = await destRes.json();
          setDestinations(destData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isLoading || reviews.length === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isLoading, reviews.length]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.destinationId && newReview.author && newReview.rating && newReview.content) {
      try {
        const response = await fetch(`/api/destinations/${newReview.destinationId}/reviews`, {
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
          setNewReview({ destinationId: '', author: '', rating: 0, content: '' });
          setShowForm(false);
          toast.success('Review submitted successfully! It will appear once approved by an admin.');
        } else {
          toast.error('Failed to submit review');
        }
      } catch (error) {
        toast.error('Error submitting review');
      }
    } else {
      toast.error('Please fill in all fields and select a rating.');
    }
  };

  if (isLoading) {
    return null; // Do not show section if loading
  }

  // We show the section even if reviews are empty, so users can still see the "Write a Review" button.

  return (
    <section ref={sectionRef} className="w-full bg-slate-900 py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 relative">
          <h2 
            className={`font-display text-4xl sm:text-5xl text-white font-semibold mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            What Travelers Say
          </h2>
          <p 
            className={`text-slate-400 text-lg max-w-2xl mx-auto mb-8 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Real stories from explorers who have experienced the magic of India with us.
          </p>

          {!showForm && (
            <div 
              className={`transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-gold hover:bg-gold-hover text-white rounded-full px-8 py-6 text-lg shadow-lg shadow-gold/20"
              >
                Share Your Experience
              </Button>
            </div>
          )}
        </div>

        {/* Write Review Form */}
        <div className={`transition-all duration-500 overflow-hidden ${showForm ? 'max-h-[800px] opacity-100 mb-16' : 'max-h-0 opacity-0 mb-0'}`}>
          <div className="max-w-2xl mx-auto bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-3xl p-8 relative shadow-2xl shadow-gold/5">
            <button 
              onClick={() => setShowForm(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="font-display text-2xl font-semibold text-white mb-6">Write a Review</h3>
            
            <form onSubmit={handleSubmitReview} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-1.5 block">Your Name</label>
                  <Input
                    placeholder="John Doe"
                    value={newReview.author}
                    onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                    className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-1.5 block">Destination Visited</label>
                  <select
                    value={newReview.destinationId}
                    onChange={(e) => setNewReview({ ...newReview, destinationId: e.target.value })}
                    className="w-full h-9 rounded-md border border-slate-700 bg-slate-900/50 px-3 py-1 text-sm shadow-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
                  >
                    <option value="" disabled className="text-slate-500">Select a destination...</option>
                    {destinations.map(d => (
                      <option key={d._id || d.id} value={d._id || d.id} className="bg-slate-800 text-white">
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">Rating</label>
                <div className="flex gap-2">
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
                        className={`w-8 h-8 transition-colors duration-200 ${
                          star <= (hoveredStar || newReview.rating)
                            ? 'fill-gold text-gold drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">Your Experience</label>
                <Textarea
                  placeholder="Tell us what you loved about your trip..."
                  value={newReview.content}
                  onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                  className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl min-h-[120px]"
                />
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-gold hover:bg-gold-hover text-white rounded-xl py-6 text-base"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Submit Review
                </Button>
              </div>
            </form>
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="flex flex-col gap-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.slice(0, visibleCount).map((review, index) => (
              <div
              key={review._id || review.id}
              className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 relative group transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-gold/10 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-gold/20 group-hover:text-gold/40 transition-colors" />
              
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                   <Star 
                     key={i} 
                     className={`w-4 h-4 ${i < review.rating ? 'fill-gold text-gold' : 'text-slate-600'}`} 
                   />
                ))}
              </div>

              <p className="text-slate-300 mb-8 relative z-10 line-clamp-4">
                "{review.content}"
              </p>

              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden shrink-0 border-2 border-slate-600 group-hover:border-gold transition-colors">
                  {review.avatar ? (
                    <img src={review.avatar} alt={review.author} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-slate-400 group-hover:text-gold transition-colors" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-white">{review.author}</h4>
                  {review.destinationName && (
                    <p className="text-sm border-b border-transparent text-slate-400 group-hover:text-gold transition-colors inline-flex">
                      {review.destinationId ? (
                        <Link to={`/destination/${review.destinationId}`} className="hover:underline">
                          Visited {review.destinationName}
                        </Link>
                      ) : (
                        <span>Visited {review.destinationName}</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
              </div>
            ))}
            </div>
            
            {visibleCount < reviews.length && (
              <div className="text-center pt-4 transition-all duration-500">
                <Button 
                  onClick={() => setVisibleCount(reviews.length)}
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-gold hover:text-white hover:border-gold rounded-full px-8 py-6 text-lg transition-all duration-300 shadow-lg shadow-black/20"
                >
                  View All Reviews
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className={`text-center py-12 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
            <p className="text-slate-400 text-lg">No reviews yet. Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </section>
  );
}
