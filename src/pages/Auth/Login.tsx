
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthContext';
import { useI18n } from '@/lib/i18n';
import { Github } from 'lucide-react';

const Login: React.FC = () => {
  const { login, loginWithGithub, isLoading } = useAuth();
  const { t, language, setLanguage } = useI18n();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };
  
  const handleGithubLogin = async () => {
    try {
      await loginWithGithub();
      navigate('/dashboard');
    } catch (err) {
      setError('GitHub login failed');
    }
  };
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <button 
          onClick={toggleLanguage}
          className="px-3 py-1.5 text-sm border border-border rounded-md"
        >
          {language === 'en' ? 'हिंदी' : 'English'}
        </button>
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">DevFocus</h1>
          <p className="text-muted-foreground mt-2">
            Productivity for Developers
          </p>
        </div>
        
        <div className="bg-card shadow-md rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold mb-6">{t('login')}</h2>
          
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <button
            onClick={handleGithubLogin}
            disabled={isLoading}
            className="flex items-center justify-center w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900 transition-colors mb-4"
          >
            <Github className="h-5 w-5 mr-2" />
            {t('loginWithGithub')}
          </button>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                {t('loginWithEmail')}
              </span>
            </div>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  {t('email')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  {t('password')}
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary border-border rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm">
                    Remember me
                  </label>
                </div>
                
                <a href="#" className="text-primary hover:underline">
                  {t('forgotPassword')}
                </a>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
              >
                {isLoading ? t('loading') : t('login')}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">{t('dontHaveAccount')} </span>
            <a href="/signup" className="text-primary hover:underline">
              {t('signup')}
            </a>
          </div>
        </div>
      </div>
      
      {/* Mock login for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 text-sm text-muted-foreground">
          <p>Development mode: Use any email/password to login</p>
        </div>
      )}
    </div>
  );
};

export default Login;
