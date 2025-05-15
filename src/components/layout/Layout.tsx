
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 flex">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/background-pattern.svg')] bg-repeat opacity-5 z-0"></div>
      <Sidebar />
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        <Navbar />
        <main className="flex-1 p-6 md:p-8 relative z-10">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <MusicPlayer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
