import React, { useState, useEffect, useRef } from 'react';
import { useData } from '@/lib/data/DataContext';
import { useI18n } from '@/lib/i18n';
import { Send } from 'lucide-react';
import { format } from 'date-fns';

const ChatRoom: React.FC = () => {
  const { chatMessages, addChatMessage } = useData();
  const { t } = useI18n();
  
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Sort messages by date (newest at the bottom)
  const sortedMessages = [...chatMessages].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  
  // Automatically scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Filter out offensive words (basic implementation)
    const filteredMessage = filterOffensiveWords(message);
    
    // Check character limit
    if (filteredMessage.length > 500) {
      alert('Message is too long. Maximum 500 characters allowed.');
      return;
    }
    
    await addChatMessage(filteredMessage);
    setMessage('');
  };
  
  const filterOffensiveWords = (text: string) => {
    // Basic implementation - in a real app, use a more comprehensive list
    const offensiveWords = ['hate', 'stupid', 'idiot'];
    let filteredText = text;
    
    offensiveWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      filteredText = filteredText.replace(regex, '***');
    });
    
    return filteredText;
  };
  
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If message is from today, show only time
    if (date.toDateString() === now.toDateString()) {
      return format(date, 'h:mm a');
    }
    
    // Otherwise show date and time
    return format(date, 'MMM dd, h:mm a');
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-13rem)] md:h-[calc(100vh-15rem)]">
      <div className="flex-none mb-4">
        <h1 className="text-2xl font-bold">{t('chatRoom')}</h1>
        <p className="text-muted-foreground">Chat with other developers about productivity</p>
      </div>
      
      <div className="flex-1 overflow-y-auto bg-card border border-border rounded-t-lg p-4">
        {sortedMessages.length > 0 ? (
          <div className="space-y-6">
            {sortedMessages.map((msg) => (
              <div key={msg.id} className="flex space-x-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-foreground flex items-center justify-center">
                  <span className="text-xs font-medium">{msg.user_email.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium text-sm">{msg.user_email.split('@')[0]}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {formatMessageTime(msg.created_at)}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{msg.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">No messages yet</p>
              <p className="text-sm">Be the first one to send a message!</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-none bg-card border-t-0 border border-border rounded-b-lg p-3">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('typeMessage')}
            className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
        <div className="text-xs text-muted-foreground mt-2 flex justify-between">
          <span>{t('typeMessage')}</span>
          <span>{message.length}/500</span>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
