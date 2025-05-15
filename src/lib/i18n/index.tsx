
import { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'hi';

type TranslationsType = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: TranslationsType = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    projects: "Projects",
    sessions: "Sessions",
    chat: "Chat",
    settings: "Settings",
    focusTimer: "Focus Timer",
    
    // Auth
    login: "Login",
    signup: "Sign Up",
    loginWith: "Login with",
    loginWithGithub: "Login with GitHub",
    loginWithEmail: "Login with Email",
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot Password?",
    resetPassword: "Reset Password",
    dontHaveAccount: "Don't have an account?",
    
    // Dashboard
    welcomeBack: "Welcome back",
    yourPoints: "Your Points",
    yourMilestones: "Your Milestones",
    upcomingTasks: "Upcoming Tasks",
    upcomingSessions: "Upcoming Sessions",
    exportData: "Export Data",
    
    // Projects
    myProjects: "My Projects",
    newProject: "New Project",
    projectName: "Project Name",
    projectDescription: "Project Description",
    createProject: "Create Project",
    noProjects: "No projects yet. Create one to get started!",
    
    // Tasks
    tasks: "Tasks",
    newTask: "New Task",
    taskName: "Task Name",
    dueDate: "Due Date",
    priority: "Priority",
    status: "Status",
    high: "High",
    medium: "Medium",
    low: "Low",
    notStarted: "Not Started",
    inProgress: "In Progress",
    completed: "Completed",
    createTask: "Create Task",
    editTask: "Edit Task",
    deleteTask: "Delete Task",
    syncWithGithub: "Sync with GitHub",
    noTasks: "No tasks yet. Create one to get started!",
    
    // Sessions
    mySessions: "My Sessions",
    newSession: "New Session",
    sessionName: "Session Name",
    startTime: "Start Time",
    duration: "Duration",
    minutes: "minutes",
    hours: "hours",
    zoomUrl: "Zoom URL (optional)",
    createSession: "Create Session",
    editSession: "Edit Session",
    deleteSession: "Delete Session",
    syncWithCalendar: "Sync with Google Calendar",
    noSessions: "No sessions yet. Schedule one to get started!",
    
    // Chat
    chatRoom: "Chat Room",
    typeMessage: "Type a message...",
    send: "Send",
    
    // Music Player
    lofiPlayer: "Lo-Fi Player",
    playMusic: "Play",
    pauseMusic: "Pause",
    
    // Milestones
    taskStreak: "Task Streak",
    studyFocus: "Study Focus",
    projectFinisher: "Project Finisher",
    
    // Settings
    language: "Language",
    english: "English",
    hindi: "Hindi",
    notifications: "Notifications",
    emailNotifications: "Email Notifications",
    
    // Focus Timer
    readyToLockIn: "Ready to lock in on your idea?",
    selectCategory: "Select a category and start the timer",
    daysLockedIn: "Days Locked In",
    keepGoing: "Keep going to increase your streak!",
    addFreedomProject: "Add Freedom Project",
    trackProgress: "Track specific project progress",
    autoPlayMusic: "Auto Play Music",
    code: "Code",
    market: "Market",
    design: "Design",
    
    // General
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    progress: "Progress",
  },
  hi: {
    // Navigation
    dashboard: "डैशबोर्ड",
    projects: "प्रोजेक्ट्स",
    sessions: "सेशन्स",
    chat: "चैट",
    settings: "सेटिंग्स",
    focusTimer: "फोकस टाइमर",
    
    // Auth
    login: "लॉगिन",
    signup: "साइन अप",
    loginWith: "इसके साथ लॉगिन करें",
    loginWithGithub: "GitHub के साथ लॉगिन करें",
    loginWithEmail: "ईमेल के साथ लॉगिन करें",
    email: "ईमेल",
    password: "पासवर्ड",
    forgotPassword: "पासवर्ड भूल गए?",
    resetPassword: "पासवर्ड रीसेट करें",
    dontHaveAccount: "अकाउंट नहीं है?",
    
    // Dashboard
    welcomeBack: "वापसी पर स्वागत है",
    yourPoints: "आपके अंक",
    yourMilestones: "आपके माइलस्टोन्स",
    upcomingTasks: "आगामी कार्य",
    upcomingSessions: "आगामी सेशन्स",
    exportData: "डेटा निर्यात करें",
    
    // Projects
    myProjects: "मेरे प्रोजेक्ट्स",
    newProject: "नया प्रोजेक्ट",
    projectName: "प्रोजेक्ट का नाम",
    projectDescription: "प्रोजेक्ट का विवरण",
    createProject: "प्रोजेक्ट बनाएं",
    noProjects: "अभी तक कोई प्रोजेक्ट नहीं है। शुरू करने के लिए एक बनाएं!",
    
    // Tasks
    tasks: "कार्य",
    newTask: "नया कार्य",
    taskName: "कार्य का नाम",
    dueDate: "नियत तारीख",
    priority: "प्राथमिकता",
    status: "स्थिति",
    high: "उच्च",
    medium: "मध्यम",
    low: "निम्न",
    notStarted: "शुरू नहीं हुआ",
    inProgress: "प्रगति पर",
    completed: "पूरा हुआ",
    createTask: "कार्य बनाएं",
    editTask: "कार्य संपादित करें",
    deleteTask: "कार्य हटाएं",
    syncWithGithub: "GitHub के साथ सिंक करें",
    noTasks: "अभी तक कोई कार्य नहीं है। शुरू करने के लिए एक बनाएं!",
    
    // Sessions
    mySessions: "मेरे सेशन्स",
    newSession: "नया सेशन",
    sessionName: "सेशन का नाम",
    startTime: "प्रारंभ समय",
    duration: "अवधि",
    minutes: "मिनट",
    hours: "घंटे",
    zoomUrl: "Zoom URL (वैकल्पिक)",
    createSession: "सेशन बनाएं",
    editSession: "सेशन संपादित करें",
    deleteSession: "सेशन हटाएं",
    syncWithCalendar: "Google कैलेंडर के साथ सिंक करें",
    noSessions: "अभी तक कोई सेशन नहीं है। शुरू करने के लिए एक शेड्यूल करें!",
    
    // Chat
    chatRoom: "चैट रूम",
    typeMessage: "संदेश लिखें...",
    send: "भेजें",
    
    // Music Player
    lofiPlayer: "लो-फाई प्लेयर",
    playMusic: "चलाएं",
    pauseMusic: "रोकें",
    
    // Milestones
    taskStreak: "टास्क स्ट्रीक",
    studyFocus: "स्टडी फोकस",
    projectFinisher: "प्रोजेक्ट फिनिशर",
    
    // Settings
    language: "भाषा",
    english: "अंग्रेज़ी",
    hindi: "हिंदी",
    notifications: "सूचनाएं",
    emailNotifications: "ईमेल सूचनाएं",
    
    // Focus Timer
    readyToLockIn: "अपने आइडिया पर फोकस करने के लिए तैयार हैं?",
    selectCategory: "एक श्रेणी चुनें और टाइमर शुरू करें",
    daysLockedIn: "फोकस के दिन",
    keepGoing: "अपनी स्ट्रीक बढ़ाने के लिए जारी रखें!",
    addFreedomProject: "फ्रीडम प्रोजेक्ट जोड़ें",
    trackProgress: "विशिष्ट प्रोजेक्ट प्रगति को ट्रैक करें",
    autoPlayMusic: "स्वचालित रूप से संगीत चलाएं",
    code: "कोड",
    market: "मार्केट",
    design: "डिज़ाइन",
    
    // General
    loading: "लोड हो रहा है...",
    save: "सहेजें",
    cancel: "रद्द करें",
    delete: "हटाएं",
    edit: "संपादित करें",
    progress: "प्रगति",
  }
};

type I18nContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  
  const t = (key: string): string => {
    return translations[language][key] || key;
  };
  
  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
