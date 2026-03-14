import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Star, MapPin, X, Check, Wifi, Wind, Coffee, Dumbbell } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { toast } from 'sonner';
import type { Hostel, Destination } from '@/shared/types';

const amenityOptions = [
  { value: 'WiFi', icon: Wifi },
  { value: 'AC', icon: Wind },
  { value: 'Cafe', icon: Coffee },
  { value: 'Gym', icon: Dumbbell },
  { value: 'Pool', icon: Wind },
  { value: 'Kitchen', icon: Coffee },
  { value: 'Rooftop', icon: Wind },
  { value: 'Common Room', icon: Coffee },
];

export function HostelsManager() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHostel, setEditingHostel] = useState<{ hostel: Hostel; destId: string } | null>(null);
  const [selectedDestId, setSelectedDestId] = useState('');
  const [formData, setFormData] = useState<Partial<Hostel>>({
    name: '',
    rating: 4.5,
    priceRange: '₹800-1200',
    description: '',
    amenities: [],
    image: '/hostel-interior.jpg',
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

  // Get all hostels flattened with destination info
  const allHostels = destinations.flatMap(dest =>
    (dest.hostels || []).map(hostel => ({
      ...hostel,
      destinationId: dest._id!,
      destinationName: dest.name,
    }))
  );

  const filteredHostels = allHostels.filter(hostel =>
    hostel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hostel.destinationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setEditingHostel(null);
    setSelectedDestId(destinations[0]?._id || '');
    setFormData({
      name: '',
      rating: 4.5,
      priceRange: '₹800-1200',
      description: '',
      amenities: [],
      image: '/hostel-interior.jpg',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (hostel: Hostel & { destinationId: string; destinationName: string }) => {
    setEditingHostel({ hostel, destId: hostel.destinationId });
    setSelectedDestId(hostel.destinationId);
    setFormData({ ...hostel });
    setIsDialogOpen(true);
  };

  const updateDestination = async (destId: string, updatedHostels: Hostel[]) => {
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`/api/destinations/${destId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ hostels: updatedHostels }),
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

  const handleDelete = async (hostelId: string, destId: string) => {
    if (confirm('Are you sure you want to delete this hostel?')) {
      const destination = destinations.find(d => d._id === destId);
      if (!destination) return;

      const updatedHostels = (destination.hostels || []).filter(h => h._id !== hostelId && h.id !== hostelId);

      const success = await updateDestination(destId, updatedHostels);
      if (success) toast.success('Hostel deleted successfully');
    }
  };

  const toggleAmenity = (amenity: string) => {
    const current = formData.amenities || [];
    if (current.includes(amenity)) {
      setFormData({ ...formData, amenities: current.filter(a => a !== amenity) });
    } else {
      setFormData({ ...formData, amenities: [...current, amenity] });
    }
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error('Please enter the hostel name');
      return;
    }

    const destination = destinations.find(d => d._id === selectedDestId);
    if (!destination) return;

    let updatedHostels = [...(destination.hostels || [])];

    if (editingHostel) {
      updatedHostels = updatedHostels.map(h =>
        (h._id === editingHostel.hostel._id || h.id === editingHostel.hostel.id) ? { ...formData, _id: h._id } as Hostel : h
      );
    } else {
      updatedHostels.push({ ...formData } as Hostel);
    }

    const success = await updateDestination(selectedDestId, updatedHostels);
    if (success) {
      toast.success(editingHostel ? 'Hostel updated successfully' : 'Hostel added successfully');
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
            placeholder="Search hostels..."
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
          Add Hostel
        </Button>
      </div>

      {/* Hostels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHostels.map((hostel) => (
          <div
            key={hostel._id || hostel.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={hostel.image}
                alt={hostel.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 rounded-full">
                <Star className="w-4 h-4 fill-star text-star" />
                <span className="text-sm font-medium">{hostel.rating}</span>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(hostel)}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-700 hover:text-gold transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(hostel._id || hostel.id!, hostel.destinationId)}
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
                  {hostel.name}
                </h3>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                  {hostel.priceRange}
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
                <MapPin className="w-4 h-4" />
                {hostel.destinationName}
              </div>
              <p className="text-slate-500 text-sm line-clamp-2 mb-3">{hostel.description}</p>
              <div className="flex flex-wrap gap-1">
                {hostel.amenities.slice(0, 4).map((amenity, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">
                    {amenity}
                  </span>
                ))}
                {hostel.amenities.length > 4 && (
                  <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">
                    +{hostel.amenities.length - 4}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredHostels.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🏨</span>
          </div>
          <h3 className="font-display text-xl text-slate-900 mb-2">No hostels found</h3>
          <p className="text-slate-500">Try adjusting your search or add a new hostel</p>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {editingHostel ? 'Edit Hostel' : 'Add New Hostel'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Destination *</label>
              <select
                value={selectedDestId}
                onChange={(e) => setSelectedDestId(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-gold focus:ring-gold/20 outline-none"
                disabled={!!editingHostel}
              >
                {destinations.map(dest => (
                  <option key={dest._id} value={dest._id}>{dest.name}</option>
                ))}
              </select>
            </div>
            {/* Form Fields */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Hostel name"
                className="rounded-xl"
              />
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
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Price Range</label>
                <Input
                  value={formData.priceRange}
                  onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                  placeholder="e.g., ₹800-1200"
                  className="rounded-xl"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Amenities</label>
              <div className="flex flex-wrap gap-2">
                {amenityOptions.map((amenity) => (
                  <button
                    key={amenity.value}
                    onClick={() => toggleAmenity(amenity.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${formData.amenities?.includes(amenity.value)
                        ? 'bg-gold text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    {amenity.value}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the hostel"
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
                {editingHostel ? 'Update' : 'Create'}
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
