import { useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, MapPin, UtensilsCrossed, Home, 
  MessageSquare, LogOut, ChevronRight, Users
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useAdmin } from '@/app/providers/AdminContext';
import { toast } from 'sonner';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/destinations', label: 'Destinations', icon: MapPin },
  { path: '/admin/food-spots', label: 'Food Spots', icon: UtensilsCrossed },
  { path: '/admin/hostels', label: 'Hostels', icon: Home },
  { path: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
];

export function AdminDashboard() {
  const { isAuthenticated, admin, logout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
      toast.error('Please login to access admin panel');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin');
    toast.success('Logged out successfully');
  };

  const getPageTitle = () => {
    const item = navItems.find(item => location.pathname.startsWith(item.path));
    return item?.label || 'Dashboard';
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 fixed h-full flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-lg text-white font-semibold">Admin Panel</h1>
              <p className="text-slate-400 text-xs">Experience India</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gold text-white shadow-lg shadow-gold/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-amber-500 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">{admin?.username}</p>
              <p className="text-slate-400 text-xs capitalize">{admin?.role}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h2 className="font-display text-2xl text-slate-900 font-semibold">
                {getPageTitle()}
              </h2>
              <p className="text-slate-500 text-sm">
                Manage your {getPageTitle().toLowerCase()} data
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="text-slate-500 hover:text-gold text-sm transition-colors"
              >
                View Website →
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
