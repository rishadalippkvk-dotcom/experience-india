export interface Destination {
  _id?: string;
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  category: 'history' | 'mystery' | 'food' | 'hostels' | 'nature';
  rating: number;
  reviewCount: number;
  location: string;
  bestTime: string;
  duration: string;
  history?: string;
  mystery?: string;
  gallery?: string[];
  foodSpots?: FoodSpot[];
  hostels?: Hostel[];
  reviews?: Review[];
}

export interface FoodSpot {
  _id?: string;
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  image: string;
  description: string;
}

export interface Hostel {
  _id?: string;
  id: string;
  name: string;
  rating: number;
  priceRange: string;
  image: string;
  amenities: string[];
  description: string;
}

export interface Review {
  _id?: string;
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
  approved?: boolean;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  count: number;
}
