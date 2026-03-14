import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from '@/shared/ui/Navbar';
import { Footer } from '@/shared/ui/Footer';
import { Toaster } from '@/shared/ui/sonner';
import { AdminProvider } from '@/app/providers/AdminContext';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';

// Public Pages
// Public Pages
import { HomePage } from '@/features/home/HomePage';
import { DestinationsPage } from '@/features/destinations/DestinationsPage';
import { DestinationDetailPage } from '@/features/destinations/DestinationDetailPage';

// Admin Pages
import { AdminLoginPage } from '@/features/auth/AdminLoginPage';
import { AdminDashboard } from '@/features/admin/AdminDashboard';
import { DashboardOverview } from '@/features/admin/DashboardOverview';
import { DestinationsManager } from '@/features/admin/DestinationsManager';
import { FoodSpotsManager } from '@/features/admin/FoodSpotsManager';
import { HostelsManager } from '@/features/admin/HostelsManager';
import { ReviewsManager } from '@/features/admin/ReviewsManager';

// Main App Layout Component
function MainLayout() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar isScrolled={isScrolled} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/destination/:id" element={<DestinationDetailPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/*" element={<MainLayout />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="destinations" element={<DestinationsManager />} />
            <Route path="food-spots" element={<FoodSpotsManager />} />
            <Route path="hostels" element={<HostelsManager />} />
            <Route path="reviews" element={<ReviewsManager />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AdminProvider>
  );
}

export default App;
