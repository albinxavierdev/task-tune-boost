
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth/AuthContext';
import { Menu, X, Home, Folders, CalendarClock, MessageSquare, Settings } from 'lucide-react';
import { useData } from '@/lib/data/DataContext';

const Navbar: React.FC = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const { totalPoints } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: t('dashboard'), icon: <Home className="h-5 w-5" /> },
    { path: '/projects', label: t('projects'), icon: <Folders className="h-5 w-5" /> },
    { path: '/sessions', label: t('sessions'), icon: <CalendarClock className="h-5 w-5" /> },
    { path: '/chat', label: t('chat'), icon: <MessageSquare className="h-5 w-5" /> },
    { path: '/settings', label: t('settings'), icon: <Settings className="h-5 w-5" /> },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header className="bg-background border-b border-border py-4 px-6 md:px-8 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="md:hidden mr-4 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="md:hidden">
            <h1 className="text-xl font-bold text-primary">DevFocus</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium mr-2">
            <span className="text-muted-foreground">{t('yourPoints')}: </span>
            <span className="text-accent-foreground">{totalPoints}</span>
          </div>
          <div className="hidden md:flex items-center">
            <div className="text-sm mr-2">
              {user?.email}
            </div>
            <div className="h-8 w-8 rounded-full bg-primary-foreground flex items-center justify-center">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="User" className="h-8 w-8 rounded-full" />
              ) : (
                <span className="text-sm font-medium">{user?.email?.charAt(0).toUpperCase()}</span>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h1 className="text-xl font-bold text-primary">DevFocus</h1>
              <button
                onClick={toggleMobileMenu}
                className="focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1 px-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
                        isActive(item.path)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                      }`}
                      onClick={toggleMobileMenu}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="p-4 border-t border-border">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary-foreground flex items-center justify-center mr-2">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="User" className="h-8 w-8 rounded-full" />
                  ) : (
                    <span className="text-sm font-medium">{user?.email?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="text-sm">
                  {user?.email}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
