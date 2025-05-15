
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthContext';
import { useI18n } from '@/lib/i18n';
import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SignUp: React.FC = () => {
  const { signUp, loginWithGithub, isLoading } = useAuth();
  const { t, language, setLanguage } = useI18n();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      await signUp(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Sign up failed');
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
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/background-pattern.svg')] bg-repeat opacity-5 z-0"></div>
      
      <div className="absolute top-4 right-4 z-10">
        <Button 
          onClick={toggleLanguage}
          variant="outline"
          className="px-4 py-2 backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/20 dark:border-white/10 text-sm font-medium rounded-md transition-all hover:bg-white/40 dark:hover:bg-black/40"
        >
          {language === 'en' ? 'हिंदी' : 'English'}
        </Button>
      </div>
      
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">DevFocus</h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Productivity for Developers
          </p>
        </div>
        
        <div className="backdrop-blur-xl bg-white/20 dark:bg-black/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/30 dark:border-white/10 p-8">
          <h2 className="text-xl font-semibold mb-6 text-center">{t('signup')}</h2>
          
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-lg backdrop-blur-sm mb-6">
              {error}
            </div>
          )}
          
          <Button
            onClick={handleGithubLogin}
            disabled={isLoading}
            className="flex items-center justify-center w-full backdrop-blur-md bg-black/80 text-white hover:bg-black/90 py-2 px-4 rounded-lg transition-all mb-6"
          >
            <Github className="h-5 w-5 mr-2" />
            {t('loginWithGithub')}
          </Button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20 dark:border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="backdrop-blur-md bg-white/30 dark:bg-black/30 px-2 text-muted-foreground">
                {t('signUp')} {t('withEmail')}
              </span>
            </div>
          </div>
          
          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                {t('email')}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-foreground focus:ring-2 focus:ring-primary/30"
                placeholder="your.email@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                {t('password')}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-foreground focus:ring-2 focus:ring-primary/30"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
                Confirm {t('password')}
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-foreground focus:ring-2 focus:ring-primary/30"
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-medium py-2 rounded-lg transition-all"
            >
              {isLoading ? t('loading') : t('signup')}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <a href="/login" className="text-primary font-medium hover:underline">
              {t('login')}
            </a>
          </div>
        </div>
      </div>
      
      {/* Mock sign up for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 text-sm text-muted-foreground absolute bottom-4 text-center">
          <p>Development mode: Use any email/password to sign up</p>
        </div>
      )}
    </div>
  );
};

export default SignUp;
