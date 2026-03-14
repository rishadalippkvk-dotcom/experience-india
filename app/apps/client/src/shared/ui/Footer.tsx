import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Send, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { toast } from 'sonner';

export function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Subscribed successfully!');
      setEmail('');
    }
  };

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Destinations', path: '/destinations' },
    { label: 'Categories', path: '/destinations' },
    { label: 'About Us', path: '/' },
  ];

  const categories = [
    { label: 'History', filter: 'history' },
    { label: 'Mystery', filter: 'mystery' },
    { label: 'Food', filter: 'food' },
    { label: 'Hostels', filter: 'hostels' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="w-full bg-beige relative overflow-hidden">
      {/* Animated Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-beige to-gold animate-gradient-shift bg-[length:200%_100%]" />

      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link
              to="/"
              className="flex items-center gap-2 group mb-6"
            >
              <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-semibold text-text-primary">
                Experience India
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              Your gateway to discovering the rich culture, history, and beauty of India. 
              Plan your perfect journey with us.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-text-primary hover:bg-gold hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-6"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold text-text-primary mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-text-secondary hover:text-gold hover:translate-x-1 transition-all duration-300 text-sm inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display text-lg font-semibold text-text-primary mb-6">
              Categories
            </h3>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.label}>
                  <Link
                    to="/destinations"
                    className="text-text-secondary hover:text-gold hover:translate-x-1 transition-all duration-300 text-sm inline-block"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-display text-lg font-semibold text-text-primary mb-6">
              Newsletter
            </h3>
            <p className="text-text-secondary text-sm mb-4">
              Subscribe for travel tips and exclusive offers.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/50" />
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 rounded-xl border-border focus:border-gold focus:ring-gold/20"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gold hover:bg-gold-hover text-white rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-gold"
              >
                <Send className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-text-secondary/60 text-sm text-center md:text-left">
              © 2024 Experience India. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <button className="text-text-secondary/60 hover:text-gold text-sm transition-colors">
                Privacy Policy
              </button>
              <button className="text-text-secondary/60 hover:text-gold text-sm transition-colors">
                Terms of Service
              </button>
              <button className="text-text-secondary/60 hover:text-gold text-sm transition-colors">
                Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
