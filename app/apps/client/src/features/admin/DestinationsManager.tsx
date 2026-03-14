import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Star, MapPin, X, Check } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { ImageUpload } from '@/shared/ui/image-upload';
import { toast } from 'sonner';
import type { Destination } from '@/shared/types';

const categories = ['history', 'nature', 'mystery', 'food', 'hostels'];

export function DestinationsManager() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [formData, setFormData] = useState<Partial<Destination>>({
    name: '',
    tagline: '',
    description: '',
    location: '',
    category: 'history',
    rating: 4.5,
    reviewCount: 0,
    bestTime: '',
    duration: '',
    image: '/hero-bg.jpg',
  });

  const filteredDestinations = destinations
    .filter(d => {
      const matchesSearch =
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const fetchDestinations = async () => {
    try {
      const response = await fetch('/api/destinations');
      const data = await response.json();
      setDestinations(data);
    } catch (error) {
      toast.error('Failed to fetch destinations');
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleAdd = () => {
    setEditingDestination(null);
    setFormData({
      name: '',
      tagline: '',
      description: '',
      location: '',
      category: 'history',
      rating: 4.5,
      reviewCount: 0,
      bestTime: '',
      duration: '',
      image: '/hero-bg.jpg',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (destination: Destination) => {
    setEditingDestination(destination);
    setFormData({ ...destination });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this destination?')) {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`/api/destinations/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setDestinations(prev => prev.filter(d => d._id !== id));
          toast.success('Destination deleted successfully');
        } else {
          toast.error('Failed to delete destination');
        }
      } catch (error) {
        toast.error('Error deleting destination');
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      if (editingDestination) {
        const response = await fetch(`/api/destinations/${editingDestination._id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const updated = await response.json();
          setDestinations(prev =>
            prev.map(d => (d._id === editingDestination._id ? updated : d))
          );
          toast.success('Destination updated successfully');
        }
      } else {
        const response = await fetch('/api/destinations', {
          method: 'POST',
          headers,
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const newDest = await response.json();
          setDestinations(prev => [...prev, newDest]);
          toast.success('Destination added successfully');
        }
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Error saving destination');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-4 flex-1 w-full sm:w-auto flex-wrap">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 focus:border-gold focus:ring-gold/20 outline-none bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 focus:border-gold focus:ring-gold/20 outline-none bg-white"
          >
            <option value="recent">Recent</option>
            <option value="rating">Highest Rating</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-gold hover:bg-gold-hover text-white rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Destination
        </Button>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDestinations.map((destination) => (
          <div
            key={destination._id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 rounded-full">
                <Star className="w-4 h-4 fill-star text-star" />
                <span className="text-sm font-medium">{destination.rating}</span>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(destination)}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-700 hover:text-gold transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => destination._id && handleDelete(destination._id)}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-700 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  {destination.name}
                </h3>
                <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium capitalize">
                  {destination.category}
                </span>
              </div>
              <p className="text-gold text-sm font-medium mb-2">{destination.tagline}</p>
              <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
                <MapPin className="w-4 h-4" />
                {destination.location}
              </div>
              <p className="text-slate-500 text-sm line-clamp-2">{destination.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDestinations.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl">
          <MapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="font-display text-xl text-slate-900 mb-2">No destinations found</h3>
          <p className="text-slate-500 mb-6">Get started by creating your first destination</p>
          <Button
            onClick={handleAdd}
            className="bg-gold hover:bg-gold-hover text-white rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Destination
          </Button>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {editingDestination ? 'Edit Destination' : 'Add New Destination'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Destination name"
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Image</label>
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Tagline</label>
                <Input
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Short tagline"
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Location *</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="City, State"
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-gold focus:ring-gold/20 outline-none"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Rating</label>
                <Input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Best Time</label>
                <Input
                  value={formData.bestTime}
                  onChange={(e) => setFormData({ ...formData, bestTime: e.target.value })}
                  placeholder="e.g., Oct-Mar"
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Duration</label>
                <Input
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 3-4 days"
                  className="rounded-xl"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Destination description"
                rows={3}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-gold focus:ring-gold/20 outline-none resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">History</label>
              <textarea
                value={formData.history || ''}
                onChange={(e) => setFormData({ ...formData, history: e.target.value })}
                placeholder="Historical background"
                rows={3}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-gold focus:ring-gold/20 outline-none resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Mystery/Legends</label>
              <textarea
                value={formData.mystery || ''}
                onChange={(e) => setFormData({ ...formData, mystery: e.target.value })}
                placeholder="Mysteries and legends"
                rows={3}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-gold focus:ring-gold/20 outline-none resize-none"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                className="flex-1 bg-gold hover:bg-gold-hover text-white rounded-xl"
              >
                <Check className="w-4 h-4 mr-2" />
                {editingDestination ? 'Update' : 'Create'}
              </Button>
              <Button
                onClick={() => setIsDialogOpen(false)}
                variant="outline"
                className="rounded-xl"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
