import React, { useState, useEffect } from 'react';
import { Timer } from './Timer';
import { Settings } from './Settings';
import { TaskList } from './TaskList';
import { ModeSelector } from './ModeSelector';
import { MotivationalQuotes } from './MotivationalQuotes';
import { BreakSuggestions } from './BreakSuggestions';
import { Settings as SettingsIcon, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';
export type Theme = 'tomato' | 'ocean' | 'forest' | 'sunset' | 'purple' | 'custom';

export interface PomodoroSettings {
  pomodoroDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  fontFamily: string;
}

export interface Task {
  id: string;
  name: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  completed: boolean;
}

const PomodoroApp = () => {
  const [currentMode, setCurrentMode] = useState<TimerMode>('pomodoro');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>('tomato');
  const [customColor, setCustomColor] = useState('#ff6b6b');
  const [showSettings, setShowSettings] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [settings, setSettings] = useState<PomodoroSettings>({
    pomodoroDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    fontFamily: 'Inter'
  });

  const themes = {
    tomato: '#ef4444',
    ocean: '#3b82f6',
    forest: '#22c55e',
    sunset: '#f97316',
    purple: '#a855f7',
    custom: customColor
  };

  const backgroundThemes = {
    tomato: {
      light: 'from-red-400 via-orange-400 to-red-500',
      dark: 'from-red-600 via-orange-600 to-red-700'
    },
    ocean: {
      light: 'from-blue-400 via-cyan-400 to-blue-500',
      dark: 'from-blue-600 via-cyan-600 to-blue-700'
    },
    forest: {
      light: 'from-green-400 via-emerald-400 to-green-500',
      dark: 'from-green-600 via-emerald-600 to-green-700'
    },
    sunset: {
      light: 'from-yellow-400 via-orange-400 to-pink-500',
      dark: 'from-yellow-600 via-orange-600 to-pink-700'
    },
    purple: {
      light: 'from-purple-400 via-pink-400 to-purple-500',
      dark: 'from-purple-600 via-pink-600 to-purple-700'
    },
    custom: {
      light: 'from-gray-400 via-gray-500 to-gray-600',
      dark: 'from-gray-600 via-gray-700 to-gray-800'
    }
  };

  useEffect(() => {
    document.documentElement.style.fontFamily = settings.fontFamily;
  }, [settings.fontFamily]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleTimerComplete = () => {
    if (currentMode === 'pomodoro') {
      setPomodoroCount(prev => prev + 1);
      
      // Update active task
      if (activeTask) {
        const updatedTask = {
          ...activeTask,
          completedPomodoros: activeTask.completedPomodoros + 1,
          completed: activeTask.completedPomodoros + 1 >= activeTask.estimatedPomodoros
        };
        setActiveTask(updatedTask);
      }

      // Auto switch to break after pomodoro
      if ((pomodoroCount + 1) % 4 === 0) {
        setCurrentMode('longBreak');
      } else {
        setCurrentMode('shortBreak');
      }
    } else {
      // After break, go back to pomodoro if task is not complete
      if (activeTask && !activeTask.completed) {
        setCurrentMode('pomodoro');
      } else {
        setActiveTask(null);
        setCurrentMode('pomodoro');
      }
    }
  };

  const handleTimerStart = () => {
    setIsRunning(true);
  };

  const startTask = (task: Task) => {
    setActiveTask(task);
    setCurrentMode('pomodoro');
    setPomodoroCount(0);
  };

  const getCurrentDuration = () => {
    switch (currentMode) {
      case 'pomodoro':
        return settings.pomodoroDuration;
      case 'shortBreak':
        return settings.shortBreakDuration;
      case 'longBreak':
        return settings.longBreakDuration;
      default:
        return settings.pomodoroDuration;
    }
  };

  const getCurrentThemeColor = () => {
    return themes[currentTheme];
  };

  const currentGradient = isDarkMode ? backgroundThemes[currentTheme].dark : backgroundThemes[currentTheme].light;

  const getModeTitle = () => {
    switch (currentMode) {
      case 'pomodoro':
        return 'POMODORO';
      case 'shortBreak':
        return 'SHORT BREAK';
      case 'longBreak':
        return 'LONG BREAK';
      default:
        return 'TIMER';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentGradient} transition-all duration-500`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              Pomodoro Timer
            </h1>
            <div className="flex items-center gap-4">
              {/* Dark/Light Mode Sliding Toggle */}
              <div className="relative">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`relative inline-flex items-center w-16 h-8 rounded-full transition-colors duration-300 focus:outline-none ${
                    isDarkMode ? 'bg-gray-700' : 'bg-yellow-400'
                  }`}
                >
                  <span
                    className={`inline-block w-6 h-6 transform transition-transform duration-300 rounded-full ${
                      isDarkMode ? 'translate-x-8 bg-gray-900' : 'translate-x-1 bg-white'
                    }`}
                  >
                    {isDarkMode ? (
                      <Moon className="w-4 h-4 text-blue-300 m-1" />
                    ) : (
                      <Sun className="w-4 h-4 text-yellow-600 m-1" />
                    )}
                  </span>
                </button>
              </div>
              
              {/* Settings Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
                className="text-white hover:bg-white/20"
              >
                <SettingsIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Active Task Display */}
          {activeTask && (
            <div className="text-center mb-6">
              <div className="bg-white/10 backdrop-blur-md border-white/20 rounded-lg p-4">
                <h3 className="text-white text-lg font-semibold">Active Task</h3>
                <p className="text-white/90">{activeTask.name}</p>
                <p className="text-white/70 text-sm">
                  {activeTask.completedPomodoros} / {activeTask.estimatedPomodoros} pomodoros completed
                </p>
              </div>
            </div>
          )}

          {/* Current Mode Title */}
          <div className="text-center mb-6">
            <h2 
              className="text-2xl font-bold text-white drop-shadow-lg"
              style={{ color: getCurrentThemeColor() }}
            >
              {getModeTitle()}
            </h2>
          </div>

          {/* Mode Selector */}
          <ModeSelector 
            currentMode={currentMode}
            onModeChange={setCurrentMode}
            isRunning={isRunning}
            themeColor={getCurrentThemeColor()}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Timer Column */}
            <div className="lg:col-span-2">
              <Timer
                mode={currentMode}
                duration={getCurrentDuration()}
                isRunning={isRunning}
                onRunningChange={setIsRunning}
                onTimerComplete={handleTimerComplete}
                themeColor={getCurrentThemeColor()}
                isDarkMode={isDarkMode}
              />
              
              {/* Motivational Content */}
              {isRunning && currentMode === 'pomodoro' && (
                <MotivationalQuotes />
              )}
              
              {isRunning && (currentMode === 'shortBreak' || currentMode === 'longBreak') && (
                <BreakSuggestions mode={currentMode} />
              )}
            </div>

            {/* Task List Column */}
            <div>
              <TaskList 
                onStartTask={startTask} 
                activeTask={activeTask} 
                onTimerStart={handleTimerStart}
              />
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <Settings
              settings={settings}
              onSettingsChange={setSettings}
              onClose={() => setShowSettings(false)}
              currentTheme={currentTheme}
              onThemeChange={setCurrentTheme}
              customColor={customColor}
              onCustomColorChange={setCustomColor}
              isDarkMode={isDarkMode}
              onDarkModeChange={setIsDarkMode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PomodoroApp;
