import { useState, useEffect } from 'react';
import { Search, Trash2, Star, MapPin, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { toast } from 'sonner';

interface ReviewWithDestination {
  _id?: string;
  id?: string;
  author: string;
  rating: number;
  date: string;
  content: string;
  approved: boolean;
  avatar?: string;
  destinationId: string;
  destinationName: string;
}

export function ReviewsManager() {
  const [reviews, setReviews] = useState<ReviewWithDestination[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending'>('all');
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/destinations/reviews/all');
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else {
        toast.error('Failed to load reviews');
      }
    } catch (error) {
      console.error('Failed to fetch reviews', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch =
      review.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.destinationName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRating = selectedRating === 'all' || Math.round(review.rating) === selectedRating;

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'approved' && review.approved) ||
      (filterStatus === 'pending' && !review.approved);

    return matchesSearch && matchesRating && matchesStatus;
  });

  const handleApprove = async (reviewId: string, destId: string) => {
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`/api/destinations/${destId}/reviews/${reviewId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Review approved successfully');
        fetchReviews();
      } else {
        toast.error('Failed to approve review');
      }
    } catch (error) {
      console.error('Approve error:', error);
      toast.error('An error occurred');
    }
  };

  const handleDelete = async (reviewId: string, destId: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      const token = localStorage.getItem('admin_token');
      try {
        const response = await fetch(`/api/destinations/${destId}/reviews/${reviewId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          toast.success('Review deleted successfully');
          fetchReviews();
        } else {
          toast.error('Failed to delete review');
        }
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('An error occurred');
      }
    }
  };

  const pendingCount = reviews.filter(r => !r.approved).length;
  const approvedCount = reviews.filter(r => r.approved).length;

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="text-sm text-slate-500 mb-1">Total Reviews</div>
          <div className="text-2xl font-bold text-slate-900">{reviews.length}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-xl shadow-sm">
          <div className="text-sm text-green-600 mb-1">Approved</div>
          <div className="text-2xl font-bold text-green-700">{approvedCount}</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-xl shadow-sm">
          <div className="text-sm text-orange-600 mb-1">Pending</div>
          <div className="text-2xl font-bold text-orange-700">{pendingCount}</div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-1 gap-4 w-full sm:w-auto flex-wrap">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 rounded-xl border border-slate-200 focus:border-gold focus:ring-gold/20 outline-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-4 py-2 rounded-xl border border-slate-200 focus:border-gold focus:ring-gold/20 outline-none bg-white"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl">
          <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full mx-auto"></div>
          <p className="text-slate-500 mt-4">Loading reviews...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review._id || review.id}
              className={`bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ${!review.approved ? 'border-2 border-orange-200' : ''
                }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden flex-shrink-0">
                    {review.avatar ? (
                      <img src={review.avatar} alt={review.author} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-200 text-xl font-bold">
                        {review.author[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-display font-semibold text-slate-900">{review.author}</h4>
                      <span className="text-sm text-slate-400">• {review.date}</span>
                      {!review.approved && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                      {review.approved && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Approved
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(review.rating)
                            ? 'fill-star text-star'
                            : 'fill-slate-200 text-slate-200'
                            }`}
                        />
                      ))}
                      <span className="text-sm text-slate-500 ml-1">({review.rating})</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
                      <MapPin className="w-4 h-4" />
                      Reviewed <span className="text-gold font-medium">{review.destinationName}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{review.content}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {!review.approved && (
                    <Button
                      onClick={() => handleApprove(review._id || review.id!, review.destinationId)}
                      size="sm"
                      className="bg-green-50 hover:bg-green-100 text-green-600 rounded-lg"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDelete(review._id || review.id!, review.destinationId)}
                    size="sm"
                    variant="ghost"
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredReviews.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💬</span>
          </div>
          <h3 className="font-display text-xl text-slate-900 mb-2">No reviews found</h3>
          <p className="text-slate-500">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
