
import React from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MusicPlayer from '../music/MusicPlayer';
import { useI18n } from '@/lib/i18n';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <MusicPlayer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
