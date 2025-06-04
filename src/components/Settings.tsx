
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { PomodoroSettings, Theme } from './PomodoroApp';

interface SettingsProps {
  settings: PomodoroSettings;
  onSettingsChange: (settings: PomodoroSettings) => void;
  onClose: () => void;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  customColor: string;
  onCustomColorChange: (color: string) => void;
  isDarkMode: boolean;
  onDarkModeChange: (darkMode: boolean) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  settings,
  onSettingsChange,
  onClose,
  currentTheme,
  onThemeChange,
  customColor,
  onCustomColorChange,
  isDarkMode,
  onDarkModeChange
}) => {
  const updateSetting = (key: keyof PomodoroSettings, value: string | number) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const fontOptions = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Times New Roman', label: 'Times New Roman' }
  ];

  const themeOptions = [
    { key: 'tomato' as Theme, name: 'Tomato', color: '#ef4444' },
    { key: 'ocean' as Theme, name: 'Ocean', color: '#3b82f6' },
    { key: 'forest' as Theme, name: 'Forest', color: '#22c55e' },
    { key: 'sunset' as Theme, name: 'Sunset', color: '#f97316' },
    { key: 'purple' as Theme, name: 'Purple', color: '#a855f7' },
    { key: 'custom' as Theme, name: 'Custom', color: customColor }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="bg-white dark:bg-gray-800 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Dark Mode Toggle */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Appearance</h3>
            
            <div className="flex items-center justify-between mb-4">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={onDarkModeChange}
              />
            </div>

            <div>
              <Label htmlFor="font">Font Family</Label>
              <Select
                value={settings.fontFamily}
                onValueChange={(value) => updateSetting('fontFamily', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.value }}>{font.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Theme Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Color Theme</h3>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              {themeOptions.map((theme) => (
                <button
                  key={theme.key}
                  onClick={() => onThemeChange(theme.key)}
                  className={`w-full h-12 rounded-lg border-2 transition-all ${
                    currentTheme === theme.key 
                      ? 'border-gray-800 dark:border-white ring-2 ring-offset-2 ring-gray-400' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: theme.color }}
                  title={theme.name}
                >
                  <span className="text-white text-xs font-medium drop-shadow">
                    {theme.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Color Picker */}
            <div>
              <Label htmlFor="custom-color">Custom Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="custom-color"
                  type="color"
                  value={customColor}
                  onChange={(e) => {
                    onCustomColorChange(e.target.value);
                    onThemeChange('custom');
                  }}
                  className="w-16 h-10 p-1 rounded cursor-pointer"
                />
                <Input
                  type="text"
                  value={customColor}
                  onChange={(e) => {
                    onCustomColorChange(e.target.value);
                    onThemeChange('custom');
                  }}
                  className="flex-1"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>

          {/* Timer Durations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Timer Durations</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="pomodoro">Pomodoro (minutes)</Label>
                <Input
                  id="pomodoro"
                  type="number"
                  min="1"
                  max="60"
                  value={settings.pomodoroDuration}
                  onChange={(e) => updateSetting('pomodoroDuration', parseInt(e.target.value) || 25)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="shortBreak">Short Break (minutes)</Label>
                <Input
                  id="shortBreak"
                  type="number"
                  min="1"
                  max="30"
                  value={settings.shortBreakDuration}
                  onChange={(e) => updateSetting('shortBreakDuration', parseInt(e.target.value) || 5)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="longBreak">Long Break (minutes)</Label>
                <Input
                  id="longBreak"
                  type="number"
                  min="1"
                  max="60"
                  value={settings.longBreakDuration}
                  onChange={(e) => updateSetting('longBreakDuration', parseInt(e.target.value) || 15)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={onClose} className="w-full">
            Save Settings
          </Button>
        </div>
      </Card>
    </div>
  );
};
