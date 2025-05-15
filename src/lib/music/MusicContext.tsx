
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { MusicTrack, PlayerState } from '../types';
import { mockMusicTracks } from '../mockData';

type MusicContextType = {
  tracks: MusicTrack[];
  playerState: PlayerState;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  setTrack: (track: MusicTrack) => void;
  nextTrack: () => void;
  previousTrack: () => void;
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const [tracks] = useState<MusicTrack[]>(mockMusicTracks);
  const [playerState, setPlayerState] = useState<PlayerState>(() => {
    const savedState = localStorage.getItem('music_player_state');
    return savedState ? JSON.parse(savedState) : {
      isPlaying: false,
      currentTrack: null,
      volume: 0.5,
    };
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio();
    audioRef.current.volume = playerState.volume;
    
    // If there was a current track, load it
    if (playerState.currentTrack) {
      audioRef.current.src = playerState.currentTrack.url;
      if (playerState.isPlaying) {
        audioRef.current.play();
      }
    }
    
    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Save player state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('music_player_state', JSON.stringify(playerState));
  }, [playerState]);
  
  const play = () => {
    if (audioRef.current) {
      // If no track is selected, select the first one
      if (!playerState.currentTrack && tracks.length > 0) {
        const track = tracks[0];
        audioRef.current.src = track.url;
        setPlayerState({
          ...playerState,
          currentTrack: track,
          isPlaying: true,
        });
      } else {
        setPlayerState({
          ...playerState,
          isPlaying: true,
        });
      }
      audioRef.current.play();
    }
  };
  
  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayerState({
        ...playerState,
        isPlaying: false,
      });
    }
  };
  
  const setVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setPlayerState({
        ...playerState,
        volume,
      });
    }
  };
  
  const setTrack = (track: MusicTrack) => {
    if (audioRef.current) {
      audioRef.current.src = track.url;
      const newState = {
        ...playerState,
        currentTrack: track,
      };
      
      setPlayerState(newState);
      
      if (playerState.isPlaying) {
        audioRef.current.play();
      }
    }
  };
  
  const getTrackIndex = (trackId: string) => {
    return tracks.findIndex(t => t.id === trackId);
  };
  
  const nextTrack = () => {
    if (tracks.length === 0 || !playerState.currentTrack) return;
    
    const currentIndex = getTrackIndex(playerState.currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setTrack(tracks[nextIndex]);
  };
  
  const previousTrack = () => {
    if (tracks.length === 0 || !playerState.currentTrack) return;
    
    const currentIndex = getTrackIndex(playerState.currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    setTrack(tracks[prevIndex]);
  };
  
  return (
    <MusicContext.Provider
      value={{
        tracks,
        playerState,
        play,
        pause,
        setVolume,
        setTrack,
        nextTrack,
        previousTrack,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
