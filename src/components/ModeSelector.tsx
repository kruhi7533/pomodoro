
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { TimerMode } from './PomodoroApp';

interface ModeSelectorProps {
  currentMode: TimerMode;
  onModeChange: (mode: TimerMode) => void;
  isRunning: boolean;
  themeColor: string;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onModeChange,
  isRunning,
  themeColor
}) => {
  const modes = [
    { key: 'pomodoro' as TimerMode, label: 'Pomodoro', description: 'Focus time' },
    { key: 'shortBreak' as TimerMode, label: 'Short Break', description: '5 min break' },
    { key: 'longBreak' as TimerMode, label: 'Long Break', description: '15 min break' }
  ];

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modes.map((mode) => (
          <Button
            key={mode.key}
            onClick={() => onModeChange(mode.key)}
            disabled={isRunning}
            variant={currentMode === mode.key ? "default" : "outline"}
            className={`h-auto p-4 text-left transition-all ${
              currentMode === mode.key
                ? 'text-white border-2'
                : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
            }`}
            style={currentMode === mode.key ? { 
              backgroundColor: themeColor, 
              borderColor: themeColor 
            } : {}}
          >
            <div>
              <div className="font-semibold">{mode.label}</div>
              <div className="text-sm opacity-75">{mode.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
};
