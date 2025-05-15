
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth/AuthContext';
import { Home, Folders, CalendarClock, MessageSquare, Settings, LogOut, Timer } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { t } = useI18n();
  const { logout } = useAuth();
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

  return (
    <div className="hidden md:flex w-64 flex-col fixed h-full backdrop-blur-xl bg-white/10 dark:bg-black/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] border-r border-white/20 dark:border-white/10 z-10">
      <div className="p-6 border-b border-white/20 dark:border-white/10">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">DevFocus</h1>
        <p className="text-sm text-muted-foreground">Productivity for Developers</p>
      </div>
      
      <nav className="flex-1 py-6 overflow-y-auto scrollbar-thin">
        <ul className="space-y-2 px-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'backdrop-blur-md bg-white/10 dark:bg-white/5 text-foreground hover:bg-white/20 dark:hover:bg-white/10'
                }`}
              >
                {item.icon}
                <span className="ml-3 font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-6 border-t border-white/20 dark:border-white/10">
        <button
          onClick={() => logout()}
          className="flex items-center w-full px-4 py-3 text-sm rounded-lg backdrop-blur-md bg-white/10 dark:bg-white/5 text-foreground hover:bg-white/20 dark:hover:bg-white/10 transition-all"
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-3 font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
