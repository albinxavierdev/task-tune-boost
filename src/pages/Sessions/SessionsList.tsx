
import React, { useState } from 'react';
import { useData } from '@/lib/data/DataContext';
import { useI18n } from '@/lib/i18n';
import { 
  Plus, 
  Clock, 
  CalendarClock, 
  Video, 
  MoreVertical, 
  Edit, 
  Trash, 
  Check, 
  X 
} from 'lucide-react';
import { format } from 'date-fns';

const SessionsList: React.FC = () => {
  const { sessions, addSession, updateSession, deleteSession, completeSession } = useData();
  const { t } = useI18n();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [sessionDuration, setSessionDuration] = useState('60');
  const [sessionZoomUrl, setSessionZoomUrl] = useState('');
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  
  const openModal = (session?: any) => {
    if (session) {
      const startDate = new Date(session.start_time);
      setSessionTitle(session.title);
      setSessionDate(format(startDate, 'yyyy-MM-dd'));
      setSessionTime(format(startDate, 'HH:mm'));
      setSessionDuration(session.duration.toString());
      setSessionZoomUrl(session.zoom_url || '');
      setEditingSessionId(session.id);
    } else {
      setSessionTitle('');
      setSessionDate('');
      setSessionTime('');
      setSessionDuration('60');
      setSessionZoomUrl('');
      setEditingSessionId(null);
    }
    
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSessionId(null);
  };
  
  const toggleDropdown = (sessionId: string) => {
    if (dropdownOpen === sessionId) {
      setDropdownOpen(null);
    } else {
      setDropdownOpen(sessionId);
    }
  };
  
  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sessionTitle.trim() || !sessionDate || !sessionTime) return;
    
    const startTime = new Date(`${sessionDate}T${sessionTime}`).toISOString();
    
    if (editingSessionId) {
      const session = sessions.find(s => s.id === editingSessionId);
      if (session) {
        await updateSession({
          ...session,
          title: sessionTitle,
          start_time: startTime,
          duration: parseInt(sessionDuration),
          zoom_url: sessionZoomUrl,
        });
      }
    } else {
      await addSession({
        title: sessionTitle,
        start_time: startTime,
        duration: parseInt(sessionDuration),
        zoom_url: sessionZoomUrl,
      });
    }
    
    closeModal();
  };
  
  const handleDeleteSession = async (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      await deleteSession(sessionId);
      setDropdownOpen(null);
    }
  };
  
  const handleCompleteSession = async (sessionId: string) => {
    await completeSession(sessionId);
    setDropdownOpen(null);
  };
  
  const getFormattedTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };
  
  const getFormattedDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };
  
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} ${t('minutes')}`;
    } else if (mins === 0) {
      return `${hours} ${t('hours')}`;
    } else {
      return `${hours} ${t('hours')} ${mins} ${t('minutes')}`;
    }
  };
  
  const isSessionUpcoming = (startTime: string) => {
    return new Date(startTime) > new Date();
  };
  
  const isSessionInProgress = (startTime: string, duration: number) => {
    const now = new Date();
    const sessionStart = new Date(startTime);
    const sessionEnd = new Date(sessionStart.getTime() + duration * 60 * 1000);
    
    return now >= sessionStart && now <= sessionEnd;
  };
  
  const sortedSessions = [...sessions].sort((a, b) => {
    return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
  });
  
  const upcomingSessions = sortedSessions.filter(s => isSessionUpcoming(s.start_time));
  const pastSessions = sortedSessions.filter(s => !isSessionUpcoming(s.start_time));
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('mySessions')}</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('newSession')}
        </button>
      </div>
      
      {/* Upcoming Sessions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Upcoming {t('sessions')}</h2>
        
        {upcomingSessions.length > 0 ? (
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div 
                key={session.id}
                className={`bg-card border border-border rounded-lg p-4 shadow-sm ${
                  isSessionInProgress(session.start_time, session.duration)
                    ? 'border-primary'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-primary-foreground flex items-center justify-center mr-4">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold">{session.title}</h3>
                      <div className="text-sm text-muted-foreground mt-1">
                        <span className="flex items-center">
                          <CalendarClock className="h-4 w-4 mr-1" />
                          {getFormattedDate(session.start_time)} at {getFormattedTime(session.start_time)}
                        </span>
                        <span className="mt-1">{formatDuration(session.duration)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {session.zoom_url && (
                      <a
                        href={session.zoom_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
                      >
                        <Video className="h-4 w-4" />
                      </a>
                    )}
                    
                    <div className="relative">
                      <button 
                        onClick={() => toggleDropdown(session.id)}
                        className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      
                      {dropdownOpen === session.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-lg z-10">
                          <button
                            onClick={() => openModal(session)}
                            className="flex items-center w-full px-4 py-2 text-sm hover:bg-muted text-left"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            {t('edit')}
                          </button>
                          <button
                            onClick={() => handleCompleteSession(session.id)}
                            className="flex items-center w-full px-4 py-2 text-sm hover:bg-muted text-left"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Mark as Completed
                          </button>
                          <button
                            onClick={() => handleDeleteSession(session.id)}
                            className="flex items-center w-full px-4 py-2 text-sm hover:bg-muted text-destructive text-left"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            {t('delete')}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {isSessionInProgress(session.start_time, session.duration) && (
                  <div className="mt-3 p-2 bg-primary/10 text-primary rounded-md text-sm">
                    This session is currently in progress
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-card border border-border rounded-lg">
            <CalendarClock className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No upcoming sessions</h3>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">
              {t('noSessions')}
            </p>
            <button
              onClick={() => openModal()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              {t('newSession')}
            </button>
          </div>
        )}
      </div>
      
      {/* Past Sessions */}
      {pastSessions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Past {t('sessions')}</h2>
          
          <div className="space-y-4">
            {pastSessions.map((session) => (
              <div 
                key={session.id}
                className="bg-muted border border-border rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-muted-foreground/10 flex items-center justify-center mr-4">
                      <Clock className="h-6 w-6 text-muted-foreground" />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-muted-foreground">{session.title}</h3>
                      <div className="text-sm text-muted-foreground/80 mt-1">
                        <span className="flex items-center">
                          <CalendarClock className="h-4 w-4 mr-1" />
                          {getFormattedDate(session.start_time)} at {getFormattedTime(session.start_time)}
                        </span>
                        <span className="mt-1">{formatDuration(session.duration)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <button 
                      onClick={() => toggleDropdown(session.id)}
                      className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    
                    {dropdownOpen === session.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-lg z-10">
                        <button
                          onClick={() => handleDeleteSession(session.id)}
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-muted text-destructive text-left"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          {t('delete')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Session Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h3 className="text-xl font-semibold mb-4">
              {editingSessionId ? t('editSession') : t('newSession')}
            </h3>
            
            <form onSubmit={handleAddSession}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="session-title" className="block text-sm font-medium mb-1">
                    {t('sessionName')}
                  </label>
                  <input
                    id="session-title"
                    type="text"
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="session-date" className="block text-sm font-medium mb-1">
                      Date
                    </label>
                    <input
                      id="session-date"
                      type="date"
                      value={sessionDate}
                      onChange={(e) => setSessionDate(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="session-time" className="block text-sm font-medium mb-1">
                      Time
                    </label>
                    <input
                      id="session-time"
                      type="time"
                      value={sessionTime}
                      onChange={(e) => setSessionTime(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="session-duration" className="block text-sm font-medium mb-1">
                    {t('duration')} (minutes)
                  </label>
                  <input
                    id="session-duration"
                    type="number"
                    min="15"
                    step="15"
                    value={sessionDuration}
                    onChange={(e) => setSessionDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="session-zoom-url" className="block text-sm font-medium mb-1">
                    {t('zoomUrl')}
                  </label>
                  <input
                    id="session-zoom-url"
                    type="url"
                    value={sessionZoomUrl}
                    onChange={(e) => setSessionZoomUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="https://zoom.us/j/123456789"
                  />
                </div>
                
                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    {editingSessionId ? t('save') : t('createSession')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionsList;
