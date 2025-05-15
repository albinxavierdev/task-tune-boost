
import React from 'react';
import { useI18n } from '@/lib/i18n';
import { Globe, Bell, Check } from 'lucide-react';

const Settings: React.FC = () => {
  const { t, language, setLanguage } = useI18n();
  
  const handleLanguageChange = (lang: 'en' | 'hi') => {
    setLanguage(lang);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t('settings')}</h1>
      
      <div className="space-y-6">
        {/* Language Settings */}
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="h-5 w-5" />
            <h2 className="text-xl font-semibold">{t('language')}</h2>
          </div>
          
          <p className="text-muted-foreground mb-4">
            Choose the language you prefer for the user interface.
          </p>
          
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`flex items-center px-4 py-3 rounded-md ${
                language === 'en' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              <span className="flex-1 text-left">{t('english')}</span>
              {language === 'en' && (
                <span className="h-4 w-4 rounded-full bg-primary-foreground flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary" />
                </span>
              )}
            </button>
            
            <button
              onClick={() => handleLanguageChange('hi')}
              className={`flex items-center px-4 py-3 rounded-md ${
                language === 'hi' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              <span className="flex-1 text-left">{t('hindi')}</span>
              {language === 'hi' && (
                <span className="h-4 w-4 rounded-full bg-primary-foreground flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary" />
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Notification Settings */}
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="h-5 w-5" />
            <h2 className="text-xl font-semibold">{t('notifications')}</h2>
          </div>
          
          <p className="text-muted-foreground mb-4">
            Configure how you want to receive notifications.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="email-notifications" className="text-sm font-medium">
                {t('emailNotifications')}
              </label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input 
                  type="checkbox" 
                  name="email-notifications" 
                  id="email-notifications" 
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label 
                  htmlFor="email-notifications" 
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-muted cursor-pointer"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label htmlFor="session-reminders" className="text-sm font-medium">
                Session Reminders
              </label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input 
                  type="checkbox" 
                  name="session-reminders" 
                  id="session-reminders" 
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  defaultChecked
                />
                <label 
                  htmlFor="session-reminders" 
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-muted cursor-pointer"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label htmlFor="task-reminders" className="text-sm font-medium">
                Task Due Date Reminders
              </label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input 
                  type="checkbox" 
                  name="task-reminders" 
                  id="task-reminders" 
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  defaultChecked
                />
                <label 
                  htmlFor="task-reminders" 
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-muted cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Add more settings sections as needed */}
      </div>
      
      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #3730A3;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #3730A3;
        }
      `}</style>
    </div>
  );
};

export default Settings;
