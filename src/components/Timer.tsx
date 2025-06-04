import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { TimerMode } from './PomodoroApp';

interface TimerProps {
  mode: TimerMode;
  duration: number;
  isRunning: boolean;
  onRunningChange: (running: boolean) => void;
  onTimerComplete: () => void;
  themeColor: string;
  isDarkMode: boolean;
}

export const Timer: React.FC<TimerProps> = ({
  mode,
  duration,
  isRunning,
  onRunningChange,
  onTimerComplete,
  themeColor,
  isDarkMode
}) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [initialDuration, setInitialDuration] = useState(duration * 60);
  const alarmRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    const newDuration = duration * 60;
    setTimeLeft(newDuration);
    setInitialDuration(newDuration);
    onRunningChange(false);
  }, [duration, mode]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            onRunningChange(false);
            
            // Play appropriate alarm based on mode
            if (mode === 'pomodoro') {
              playVictoryDrumBeats();
            } else {
              alarmRef.current = playBreakAlarm();
            }
            
            onTimerComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onRunningChange, onTimerComplete, mode]);

  const playVictoryDrumBeats = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    let currentTime = audioContext.currentTime;
    
    // Create drum beat pattern
    const drumBeats = [
      { frequency: 100, duration: 0.1 },
      { frequency: 150, duration: 0.1 },
      { frequency: 100, duration: 0.1 },
      { frequency: 200, duration: 0.2 },
      { frequency: 100, duration: 0.1 },
      { frequency: 150, duration: 0.1 },
      { frequency: 250, duration: 0.3 }
    ];

    drumBeats.forEach((beat, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = beat.frequency;
      oscillator.type = 'sawtooth';
      
      gainNode.gain.setValueAtTime(0.4, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + beat.duration);
      
      oscillator.start(currentTime);
      oscillator.stop(currentTime + beat.duration);
      
      currentTime += beat.duration + 0.1; // Small gap between beats
    });
  };

  const playBreakAlarm = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    // Create pulsing effect for 5 seconds
    let currentTime = audioContext.currentTime;
    for (let i = 0; i < 10; i++) { // 10 pulses over 5 seconds
      gainNode.gain.setValueAtTime(0, currentTime + i * 0.5);
      gainNode.gain.setValueAtTime(0.3, currentTime + i * 0.5 + 0.1);
      gainNode.gain.setValueAtTime(0, currentTime + i * 0.5 + 0.4);
    }
    
    oscillator.start(currentTime);
    oscillator.stop(currentTime + 5);

    return {
      stop: () => {
        try {
          oscillator.stop();
        } catch (e) {
          // Oscillator already stopped
        }
      }
    };
  };

  // Stop alarm when component unmounts or timer resets
  useEffect(() => {
    return () => {
      if (alarmRef.current) {
        alarmRef.current.stop();
      }
    };
  }, []);

  const toggleTimer = () => {
    // Stop any ongoing alarm when starting/stopping timer
    if (alarmRef.current) {
      alarmRef.current.stop();
      alarmRef.current = null;
    }
    onRunningChange(!isRunning);
  };

  const resetTimer = () => {
    // Stop any ongoing alarm when resetting
    if (alarmRef.current) {
      alarmRef.current.stop();
      alarmRef.current = null;
    }
    setTimeLeft(initialDuration);
    onRunningChange(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((initialDuration - timeLeft) / initialDuration) * 100;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getModeTitle = () => {
    switch (mode) {
      case 'pomodoro':
        return 'Focus Time';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Timer';
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white p-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-8">{getModeTitle()}</h2>
        
        {/* Circular Progress Timer */}
        <div className="relative inline-block mb-8">
          <svg
            width="280"
            height="280"
            className="transform -rotate-90"
          >
            {/* Background circle */}
            <circle
              cx="140"
              cy="140"
              r="120"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="140"
              cy="140"
              r="120"
              stroke={themeColor}
              strokeWidth="8"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-linear"
              style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.3))' }}
            />
          </svg>
          
          {/* Timer display in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-bold mb-2 font-mono">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm opacity-75">
                {timeLeft === 0 ? 'Time\'s up!' : 'remaining'}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={toggleTimer}
            size="lg"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            disabled={timeLeft === 0}
          >
            {isRunning ? (
              <Pause className="w-6 h-6 mr-2" />
            ) : (
              <Play className="w-6 h-6 mr-2" />
            )}
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          
          <Button
            onClick={resetTimer}
            size="lg"
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white border-white/30"
          >
            <RotateCcw className="w-6 h-6 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
};
