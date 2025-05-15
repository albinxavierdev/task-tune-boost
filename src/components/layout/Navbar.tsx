
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth/AuthContext';
import { Menu, X, Home, Folders, CalendarClock, MessageSquare, Settings, Timer } from 'lucide-react';
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
    { path: '/focus-timer', label: 'Focus Timer', icon: <Timer className="h-5 w-5" /> },
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
      <header className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border-b border-white/20 dark:border-white/10 py-4 px-6 md:px-8 flex items-center justify-between z-20">
        <div className="flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="md:hidden mr-4 focus:outline-none text-foreground"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="md:hidden">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">DevFocus</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="backdrop-blur-md bg-white/10 dark:bg-white/5 px-4 py-2 rounded-full border border-white/20 dark:border-white/10">
            <span className="text-sm font-medium mr-1 text-muted-foreground">{t('yourPoints')}: </span>
            <span className="text-accent-foreground font-semibold">{totalPoints}</span>
          </div>
          <div className="hidden md:flex items-center">
            <div className="text-sm mr-3">
              {user?.email}
            </div>
            <div className="h-10 w-10 rounded-full backdrop-blur-md bg-primary/10 border border-white/20 dark:border-white/10 flex items-center justify-center overflow-hidden">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="User" className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm font-medium">{user?.email?.charAt(0).toUpperCase()}</span>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 backdrop-blur-xl bg-white/10 dark:bg-black/30 md:hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-white/10">
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">DevFocus</h1>
              <button
                onClick={toggleMobileMenu}
                className="focus:outline-none text-foreground"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-6 px-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-3 text-sm rounded-lg transition-all ${
                        isActive(item.path)
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                          : 'backdrop-blur-md bg-white/10 dark:bg-white/5 text-foreground hover:bg-white/20 dark:hover:bg-white/10'
                      }`}
                      onClick={toggleMobileMenu}
                    >
                      {item.icon}
                      <span className="ml-3 font-medium">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="p-6 border-t border-white/20 dark:border-white/10">
              <div className="flex items-center p-3 backdrop-blur-md bg-white/10 dark:bg-white/5 rounded-lg">
                <div className="h-10 w-10 rounded-full backdrop-blur-md bg-primary/10 border border-white/20 dark:border-white/10 flex items-center justify-center mr-3 overflow-hidden">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="User" className="h-full w-full object-cover" />
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
