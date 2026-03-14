import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, UtensilsCrossed, Home, MessageSquare,
  TrendingUp, Users, Eye, ArrowRight, Star
} from 'lucide-react';
import type { Destination } from '@/shared/types';

export function DashboardOverview() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/destinations');
      if (response.ok) {
        const data = await response.json();
        setDestinations(data);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const totalFoodSpots = destinations.reduce((acc, d) => acc + (d.foodSpots?.length || 0), 0);
  const totalHostels = destinations.reduce((acc, d) => acc + (d.hostels?.length || 0), 0);
  const pendingReviews = destinations.reduce(
    (acc, d) => acc + (d.reviews?.filter(r => !r.approved).length || 0),
    0
  );

  const stats = [
    {
      label: 'Total Destinations',
      value: destinations.length,
      icon: MapPin,
      color: 'bg-blue-500',
      path: '/admin/dashboard/destinations'
    },
    {
      label: 'Food Spots',
      value: totalFoodSpots,
      icon: UtensilsCrossed,
      color: 'bg-orange-500',
      path: '/admin/dashboard/food-spots'
    },
    {
      label: 'Hostels',
      value: totalHostels,
      icon: Home,
      color: 'bg-green-500',
      path: '/admin/dashboard/hostels'
    },
    {
      label: 'Pending Reviews',
      value: pendingReviews,
      icon: MessageSquare,
      color: 'bg-purple-500',
      path: '/admin/dashboard/reviews'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-gold to-gold-hover rounded-2xl p-8 text-white">
        <h1 className="font-display text-3xl font-bold mb-2">Welcome to Admin Dashboard</h1>
        <p className="text-white/90">Manage your destinations, food spots, hostels, and reviews</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            onClick={() => navigate(stat.path)}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-gold transition-colors" />
            </div>
            <h3 className="text-3xl font-display font-semibold text-slate-900 mb-1">
              {stat.value}
            </h3>
            <p className="text-slate-500 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl font-semibold text-slate-900">
              System Overview
            </h3>
            <TrendingUp className="w-5 h-5 text-gold" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Destinations</p>
                  <p className="text-xl font-bold text-slate-900">{destinations.length}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Food Spots</p>
                  <p className="text-xl font-bold text-slate-900">{totalFoodSpots}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Home className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Hostels</p>
                  <p className="text-xl font-bold text-slate-900">{totalHostels}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-orange-50 border border-orange-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-orange-600 font-medium">Pending Reviews</p>
                  <p className="text-xl font-bold text-orange-700">{pendingReviews}</p>
                </div>
              </div>
              {pendingReviews > 0 && (
                <button
                  onClick={() => navigate('/admin/dashboard/reviews')}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                >
                  Review Now
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl font-semibold text-slate-900">
              Quick Actions
            </h3>
            <Users className="w-5 h-5 text-gold" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/admin/dashboard/destinations')}
              className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all text-left group"
            >
              <MapPin className="w-8 h-8 text-blue-600 mb-3" />
              <p className="font-medium text-slate-900">Add Destination</p>
              <p className="text-slate-500 text-sm">Create new place</p>
            </button>
            <button
              onClick={() => navigate('/admin/dashboard/food-spots')}
              className="p-6 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all text-left group"
            >
              <UtensilsCrossed className="w-8 h-8 text-orange-600 mb-3" />
              <p className="font-medium text-slate-900">Add Food Spot</p>
              <p className="text-slate-500 text-sm">Add restaurant</p>
            </button>
            <button
              onClick={() => navigate('/admin/dashboard/hostels')}
              className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all text-left group"
            >
              <Home className="w-8 h-8 text-green-600 mb-3" />
              <p className="font-medium text-slate-900">Add Hostel</p>
              <p className="text-slate-500 text-sm">Add accommodation</p>
            </button>
            <button
              onClick={() => navigate('/admin/dashboard/reviews')}
              className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all text-left group"
            >
              <Eye className="w-8 h-8 text-purple-600 mb-3" />
              <p className="font-medium text-slate-900">Moderate Reviews</p>
              <p className="text-slate-500 text-sm">Check feedback</p>
            </button>
          </div>
        </div>
      </div>

      {/* Top Destinations */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-display text-xl font-semibold text-slate-900 mb-6">
          Top Rated Destinations
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-3 px-4 text-slate-500 font-medium text-sm">Destination</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium text-sm">Category</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium text-sm">Rating</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium text-sm">Reviews</th>
              </tr>
            </thead>
            <tbody>
              {destinations
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 5)
                .map((dest) => (
                  <tr key={dest._id || dest.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img src={dest.image} alt={dest.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium text-slate-900">{dest.name}</p>
                          <p className="text-slate-500 text-xs">{dest.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium capitalize">
                        {dest.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-star text-star" />
                        <span className="font-medium">{dest.rating}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-500">{dest.reviewCount}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {destinations.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            No destinations yet. Start by adding your first destination!
          </div>
        )}
      </div>
    </div>
  );
}
