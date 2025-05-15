
import React, { useState, useEffect } from 'react';
import { Play, Check, Pause } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/lib/data/DataContext';
import { useMusic } from '@/lib/music/MusicContext';

const FocusTimer: React.FC = () => {
  const { t } = useI18n();
  const { totalPoints } = useData();
  const { play: playMusic, pause: pauseMusic, playerState } = useMusic();
  
  const [timerActive, setTimerActive] = useState(false);
  const [time, setTime] = useState(0);
  const [category, setCategory] = useState<'code' | 'market' | 'design' | null>(null);
  const [autoPlayMusic, setAutoPlayMusic] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (timerActive) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
      
      if (autoPlayMusic && !playerState.isPlaying) {
        playMusic();
      }
    } else if (interval) {
      clearInterval(interval);
      if (playerState.isPlaying && autoPlayMusic) {
        pauseMusic();
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, autoPlayMusic, playerState.isPlaying, playMusic, pauseMusic]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [hours, minutes, secs]
      .map(v => v < 10 ? "0" + v : v)
      .join(":");
  };

  const toggleTimer = () => {
    setTimerActive(!timerActive);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTime(0);
    setCategory(null);
  };

  const handleCategorySelect = (selected: 'code' | 'market' | 'design') => {
    setCategory(selected);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column - Stats & Illustrations */}
        <div className="w-full md:w-1/3">
          <Card className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-indigo-950 dark:to-purple-900 border-none shadow-md mb-6">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Days Locked In</h3>
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{Math.floor(totalPoints / 100)}</div>
                <p className="text-sm text-muted-foreground mt-2">Keep going to increase your streak!</p>
              </div>
            </CardContent>
          </Card>
          
          <div className="hidden md:block mt-8">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/4987/4987378.png" 
              alt="Focus Illustration"
              className="w-64 h-64 mx-auto opacity-80" 
            />
            <div className="text-center mt-4 text-muted-foreground">
              <p className="font-medium text-lg">LOFI</p>
              <p className="text-sm">Focus & Productivity</p>
            </div>
          </div>
        </div>
        
        {/* Right Column - Timer & Controls */}
        <div className="w-full md:w-2/3">
          <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Ready to lock in on your idea?</h2>
                <p className="text-muted-foreground">Select a category and start the timer</p>
              </div>
              
              <div className="flex justify-center mb-8">
                <div className="text-6xl font-mono font-bold tracking-widest text-indigo-800 dark:text-indigo-400">
                  {formatTime(time)}
                </div>
              </div>
              
              <div className="flex justify-center gap-4 mb-10">
                <Button 
                  size="lg" 
                  className="h-14 w-14 rounded-full bg-amber-500 hover:bg-amber-600 text-white"
                  onClick={toggleTimer}
                >
                  {timerActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="h-14 w-14 rounded-full border-2"
                  onClick={resetTimer}
                  disabled={time === 0}
                >
                  <Check className="h-6 w-6" />
                </Button>
                
                <div className="flex items-center ml-2">
                  <Switch 
                    id="auto-music" 
                    checked={autoPlayMusic}
                    onCheckedChange={setAutoPlayMusic}
                  />
                  <label htmlFor="auto-music" className="ml-2 text-sm font-medium">
                    Auto Play Music
                  </label>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  variant={category === 'code' ? 'default' : 'outline'} 
                  className={`px-8 py-6 rounded-lg ${category === 'code' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}`}
                  onClick={() => handleCategorySelect('code')}
                >
                  Code
                </Button>
                <Button
                  variant={category === 'market' ? 'default' : 'outline'}
                  className={`px-8 py-6 rounded-lg ${category === 'market' ? 'bg-teal-600 hover:bg-teal-700' : ''}`}
                  onClick={() => handleCategorySelect('market')}
                >
                  Market
                </Button>
                <Button
                  variant={category === 'design' ? 'default' : 'outline'}
                  className={`px-8 py-6 rounded-lg ${category === 'design' ? 'bg-amber-600 hover:bg-amber-700' : ''}`}
                  onClick={() => handleCategorySelect('design')}
                >
                  Design
                </Button>
              </div>
              
              <div className="mt-8">
                <Card className="bg-gray-50 dark:bg-gray-800 border-none">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Add Freedom Project</h3>
                        <p className="text-sm text-muted-foreground">Track specific project progress</p>
                      </div>
                      <Button variant="ghost" size="sm">+ Add</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;
