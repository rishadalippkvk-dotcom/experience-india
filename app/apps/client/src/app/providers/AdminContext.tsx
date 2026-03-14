import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface AdminUser {
  username: string;
  role: 'admin';
}

interface AdminContextType {
  isAuthenticated: boolean;
  admin: AdminUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Admin credentials (handled by backend)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_auth') === 'true';
  });
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const user: AdminUser = { username: data.username, role: data.role };
        setIsAuthenticated(true);
        setAdmin(user);
        localStorage.setItem('admin_auth', 'true');
        localStorage.setItem('admin_user', JSON.stringify(user));
        localStorage.setItem('admin_token', data.token); // Store token
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setAdmin(null);
    localStorage.removeItem('admin_auth');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_token');
  }, []);

  return (
    <AdminContext.Provider value={{ isAuthenticated, admin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
