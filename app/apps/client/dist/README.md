# Experience India - Destination Explorer

A digital travel magazine platform for discovering India's rich culture, history, and destinations. Built with React, TypeScript, and Tailwind CSS.

![Experience India](public/hero-bg.jpg)

## 🌟 Features

### Public Features

#### 🏠 Home Page
- **Hero Section**: Full-screen immersive experience with parallax scrolling
- **Featured Destinations**: Handpicked destinations with tilted card animations
- **Category Explorer**: Browse by History, Mystery, Food, and Hostels
- **Newsletter Subscription**: Email signup for travel updates

#### 🗺️ Destinations Page
- **Grid Layout**: Responsive masonry-style destination cards
- **Search Functionality**: Real-time search by name, tagline, or location
- **Category Filters**: Filter by All, History, Nature, Mystery, Top Rated
- **Destination Cards**: Image, rating, location, description preview

#### 📍 Destination Detail Page
- **Hero Banner**: Full-width image with destination stats
- **Sticky Navigation**: Quick jump to sections
- **Overview**: Destination description
- **History Section**: Cultural background and historical facts
- **Mystery Section**: Legends, ghost stories, and unknown facts
- **Photo Gallery**: Grid display of destination images
- **Food Spots**: Nearby restaurants with ratings and cuisine info
- **Hostels**: Accommodation options with amenities and pricing
- **Reviews**: User reviews with star ratings and submission form

### Admin Features

#### 🔐 Admin Authentication
- **Secure Login**: `/admin` route with username/password
- **Default Credentials**:
  - Username: `admin`
  - Password: `admin123`
- **Session Management**: Persistent login with localStorage
- **Protected Routes**: Automatic redirect for unauthorized access

#### 📊 Admin Dashboard
- **Statistics Overview**: Total destinations, food spots, hostels, reviews
- **Recent Activity**: Latest actions performed
- **Quick Actions**: Shortcut buttons for common tasks
- **Top Rated Table**: Highest-rated destinations list

#### 🗂️ Destinations Management
- **View All**: Grid view of all destinations
- **Add Destination**: Create new with full details
- **Edit Destination**: Modify existing information
- **Delete Destination**: Remove with confirmation
- **Fields**: Name, tagline, location, category, rating, best time, duration, description, history, mystery

#### 🍽️ Food Spots Management
- **View All**: List of all restaurants across destinations
- **Add Food Spot**: Add new restaurant
- **Edit Food Spot**: Update details
- **Delete Food Spot**: Remove entry
- **Fields**: Name, cuisine, price range, rating, description, destination association

#### 🏨 Hostels Management
- **View All**: Accommodation listings
- **Add Hostel**: Create new hostel entry
- **Edit Hostel**: Update information
- **Delete Hostel**: Remove with confirmation
- **Amenities**: WiFi, AC, Pool, Gym, Kitchen, Rooftop, Common Room

#### 💬 Reviews Moderation
- **View All Reviews**: Complete list with filtering
- **Filter by Rating**: 1-5 star filter buttons
- **Search**: Find by author or content
- **Approve Review**: Mark as approved
- **Delete Review**: Remove inappropriate content

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Build Tool**: Vite

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd app
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## 📁 Project Structure

```
app/
├── public/                 # Static assets (images)
│   ├── hero-bg.jpg
│   ├── jaipur.jpg
│   ├── varanasi.jpg
│   └── ...
├── src/
│   ├── components/         # Reusable components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ui/            # shadcn/ui components
│   ├── contexts/          # React contexts
│   │   └── AdminContext.tsx
│   ├── data/              # Static data
│   │   └── destinations.ts
│   ├── pages/             # Page components
│   │   ├── HomePage.tsx
│   │   ├── DestinationsPage.tsx
│   │   ├── DestinationDetailPage.tsx
│   │   └── admin/         # Admin pages
│   │       ├── AdminLoginPage.tsx
│   │       ├── AdminDashboard.tsx
│   │       ├── DashboardOverview.tsx
│   │       ├── DestinationsManager.tsx
│   │       ├── FoodSpotsManager.tsx
│   │       ├── HostelsManager.tsx
│   │       └── ReviewsManager.tsx
│   ├── sections/          # Home page sections
│   │   ├── HeroSection.tsx
│   │   ├── FeaturedDestinations.tsx
│   │   ├── CategoryExplorer.tsx
│   │   └── NewsletterSection.tsx
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── App.tsx            # Main app component
│   ├── index.css          # Global styles
│   └── main.tsx           # Entry point
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🔑 Admin Access

### How to Access Admin Panel

1. Navigate to `/admin` (e.g., `http://localhost:5173/admin`)
2. Enter credentials:
   - Username: `admin`
   - Password: `admin123`
3. Click "Access Dashboard"

### Admin Navigation

Once logged in, use the sidebar to navigate:
- **Dashboard**: Overview and statistics
- **Destinations**: Manage travel destinations
- **Food Spots**: Manage restaurant listings
- **Hostels**: Manage accommodation options
- **Reviews**: Moderate user reviews

### Logout

Click the "Logout" button in the sidebar to end the session.

## 🎨 Design System

### Colors
- **Primary Gold**: `#d4a853`
- **Gold Hover**: `#c49a4a`
- **Background Cream**: `#fefcf5`
- **Background Beige**: `#f6f1e4`
- **Text Primary**: `#1a1a1a`
- **Text Secondary**: `#4a4a4a`
- **Star Rating**: `#f5c518`

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Animations
- Fade in up on scroll
- Card hover effects (lift, shadow)
- Image zoom on hover
- Parallax scrolling in hero

## 📝 Data Models

### Destination
```typescript
interface Destination {
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
```

### FoodSpot
```typescript
interface FoodSpot {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  image: string;
  description: string;
}
```

### Hostel
```typescript
interface Hostel {
  id: string;
  name: string;
  rating: number;
  priceRange: string;
  image: string;
  amenities: string[];
  description: string;
}
```

### Review
```typescript
interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
}
```

## 🔒 Security Notes

- Admin credentials are stored in the frontend for demo purposes
- In production, move authentication to a backend API
- Use environment variables for sensitive data
- Implement proper session management with JWT tokens
- Add rate limiting for login attempts

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📧 Contact

For questions or support, please contact the development team.

---

**Experience India** - Discover the stories of India 🇮🇳
