import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Star, MapPin, X, Check } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { toast } from 'sonner';
import type { FoodSpot, Destination } from '@/shared/types';

export function FoodSpotsManager() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSpot, setEditingSpot] = useState<{ spot: FoodSpot; destId: string } | null>(null);
  const [selectedDestId, setSelectedDestId] = useState('');
  const [formData, setFormData] = useState<Partial<FoodSpot>>({
    name: '',
    cuisine: '',
    rating: 4.5,
    priceRange: '₹₹',
    description: '',
    image: '/food-thali.jpg',
  });

  const fetchDestinations = async () => {
    try {
      const response = await fetch('/api/destinations');
      if (response.ok) {
        const data = await response.json();
        setDestinations(data);
      }
    } catch (error) {
      console.error('Failed to fetch destinations', error);
      toast.error('Failed to load data');
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  // Get all food spots flattened with destination info
  const allFoodSpots = destinations.flatMap(dest =>
    (dest.foodSpots || []).map(spot => ({
      ...spot,
      destinationId: dest._id!,
      destinationName: dest.name,
    }))
  );

  const filteredSpots = allFoodSpots.filter(spot =>
    spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spot.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spot.destinationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setEditingSpot(null);
    setSelectedDestId(destinations[0]?._id || '');
    setFormData({
      name: '',
      cuisine: '',
      rating: 4.5,
      priceRange: '₹₹',
      description: '',
      image: '/food-thali.jpg',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (spot: FoodSpot & { destinationId: string; destinationName: string }) => {
    setEditingSpot({ spot, destId: spot.destinationId });
    setSelectedDestId(spot.destinationId);
    setFormData({ ...spot });
    setIsDialogOpen(true);
  };

  const updateDestination = async (destId: string, updatedFoodSpots: FoodSpot[]) => {
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`/api/destinations/${destId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ foodSpots: updatedFoodSpots }),
      });

      if (response.ok) {
        fetchDestinations();
        return true;
      } else {
        toast.error('Failed to save changes');
        return false;
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('An error occurred');
      return false;
    }
  };

  const handleDelete = async (spotId: string, destId: string) => {
    if (confirm('Are you sure you want to delete this food spot?')) {
      const destination = destinations.find(d => d._id === destId);
      if (!destination) return;

      const updatedFoodSpots = (destination.foodSpots || []).filter(s => s._id !== spotId && s.id !== spotId); // Check both _id and id

      const success = await updateDestination(destId, updatedFoodSpots);
      if (success) toast.success('Food spot deleted successfully');
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.cuisine) {
      toast.error('Please fill in all required fields');
      return;
    }

    const destination = destinations.find(d => d._id === selectedDestId);
    if (!destination) return;

    let updatedFoodSpots = [...(destination.foodSpots || [])];

    if (editingSpot) {
      // If we switched destination during edit (uncommon but possible UI-wise), we'd need to handle remove-then-add.
      // For simplicity, we assume editing stays in same destination or just updates the current selectedDestId's list
      // But wait... the UI allows selecting a destination.

      // If destination changed?
      if (editingSpot.destId !== selectedDestId) {
        // This is complex: remove from old, add to new. 
        // Let's simplify: Edit mode locks destination or we handle it.
        // For now, let's assume standard edit within same destination or add new to selected.
      }

      // Allow simple update for now
      updatedFoodSpots = updatedFoodSpots.map(s =>
        (s._id === editingSpot.spot._id || s.id === editingSpot.spot.id) ? { ...formData, _id: s._id } as FoodSpot : s
      );
    } else {
      // Add new
      updatedFoodSpots.push({ ...formData } as FoodSpot);
    }

    const success = await updateDestination(selectedDestId, updatedFoodSpots);
    if (success) {
      toast.success(editingSpot ? 'Food spot updated successfully' : 'Food spot added successfully');
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search food spots..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
        <Button
          onClick={handleAdd}
          className="bg-gold hover:bg-gold-hover text-white rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Food Spot
        </Button>
      </div>

      {/* Food Spots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpots.map((spot) => (
          <div
            key={spot._id || spot.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            {/* ... (Image and Card Content - same as before) ... */}
            <div className="relative h-40 overflow-hidden">
              <img
                src={spot.image}
                alt={spot.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 rounded-full">
                <Star className="w-4 h-4 fill-star text-star" />
                <span className="text-sm font-medium">{spot.rating}</span>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(spot)}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-700 hover:text-gold transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(spot._id || spot.id!, spot.destinationId)}
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
                  {spot.name}
                </h3>
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                  {spot.priceRange}
                </span>
              </div>
              <p className="text-gold text-sm font-medium mb-2">{spot.cuisine}</p>
              <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
                <MapPin className="w-4 h-4" />
                {spot.destinationName}
              </div>
              <p className="text-slate-500 text-sm line-clamp-2">{spot.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredSpots.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🍽️</span>
          </div>
          <h3 className="font-display text-xl text-slate-900 mb-2">No food spots found</h3>
          <p className="text-slate-500">Try adjusting your search or add a new food spot</p>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {editingSpot ? 'Edit Food Spot' : 'Add New Food Spot'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Destination *</label>
              <select
                value={selectedDestId}
                onChange={(e) => setSelectedDestId(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-gold focus:ring-gold/20 outline-none"
                disabled={!!editingSpot}
              >
                {destinations.map(dest => (
                  <option key={dest._id} value={dest._id}>{dest.name}</option>
                ))}
              </select>
            </div>
            {/* Same form fields as before */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Restaurant name"
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Cuisine *</label>
                <Input
                  value={formData.cuisine}
                  onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                  placeholder="e.g., Rajasthani"
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Price Range</label>
                <select
                  value={formData.priceRange}
                  onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-gold focus:ring-gold/20 outline-none"
                >
                  <option value="₹">₹ Budget</option>
                  <option value="₹₹">₹₹ Moderate</option>
                  <option value="₹₹₹">₹₹₹ Expensive</option>
                  <option value="₹₹₹₹">₹₹₹₹ Luxury</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the restaurant"
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
                {editingSpot ? 'Update' : 'Create'}
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
