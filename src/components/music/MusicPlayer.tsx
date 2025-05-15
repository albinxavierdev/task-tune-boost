
import React, { useState } from 'react';
import { useMusic } from '@/lib/music/MusicContext';
import { useI18n } from '@/lib/i18n';
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

const MusicPlayer: React.FC = () => {
  const { t } = useI18n();
  const { 
    tracks, 
    playerState, 
    play, 
    pause, 
    setVolume, 
    setTrack, 
    nextTrack, 
    previousTrack 
  } = useMusic();
  
  const [expanded, setExpanded] = useState(false);
  const { isPlaying, currentTrack, volume } = playerState;
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };
  
  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };
  
  return (
    <div className="bg-background border-t border-border p-2 md:p-3">
      <div className="max-w-7xl mx-auto">
        {/* Collapsed view */}
        {!expanded ? (
          <div className="flex items-center justify-between">
            <button 
              onClick={toggleExpanded}
              className="flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <Music className="h-4 w-4 mr-2" />
              <span>{t('lofiPlayer')}</span>
            </button>
            
            <div className="flex items-center space-x-2">
              {currentTrack && (
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {currentTrack.title} - {currentTrack.artist}
                </span>
              )}
              
              <button
                onClick={togglePlayPause}
                className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
            </div>
          </div>
        ) : (
          // Expanded view
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <button 
                onClick={toggleExpanded}
                className="flex items-center text-sm font-medium"
              >
                <Music className="h-4 w-4 mr-2" />
                <span>{t('lofiPlayer')}</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={previousTrack}
                  className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  <SkipBack className="h-4 w-4" />
                </button>
                
                <button
                  onClick={togglePlayPause}
                  className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>
                
                <button
                  onClick={nextTrack}
                  className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  <SkipForward className="h-4 w-4" />
                </button>
                
                <div className="flex items-center space-x-2 ml-2">
                  {volume === 0 ? (
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  )}
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 md:w-24"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {tracks.map((track) => (
                <button
                  key={track.id}
                  onClick={() => setTrack(track)}
                  className={`text-left p-2 rounded-md text-sm ${
                    currentTrack?.id === track.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                >
                  <div className="font-medium truncate">{track.title}</div>
                  <div className="text-xs opacity-80 truncate">{track.artist}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;
