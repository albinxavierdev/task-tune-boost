
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
    <div className="hidden md:flex w-64 flex-col fixed h-full bg-sidebar border-r border-border">
      <div className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">DevFocus</h1>
        <p className="text-sm text-muted-foreground">Productivity for Developers</p>
      </div>
      
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border">
        <button
          onClick={() => logout()}
          className="flex items-center w-full px-4 py-2 text-sm rounded-md text-foreground hover:bg-muted transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
