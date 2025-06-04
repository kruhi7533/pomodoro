
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import type { TimerMode } from './PomodoroApp';

interface BreakSuggestionsProps {
  mode: TimerMode;
}

const shortBreakSuggestions = [
  "🧘 Take 5 deep breaths and stretch your arms",
  "💧 Drink a glass of water to stay hydrated",
  "👀 Look away from your screen and focus on something distant",
  "🚶 Take a quick walk around your room or office",
  "🤸 Do some light stretching exercises",
  "🌱 Water your plants or look at something green",
  "🎵 Listen to your favorite song",
  "📱 Text a friend or family member",
  "☕ Make yourself a healthy snack",
  "🧊 Splash cold water on your face to refresh",
  "🪟 Open a window and get some fresh air",
  "🎯 Do some quick neck and shoulder rolls",
  "📚 Read a few pages of a book",
  "🧹 Organize your desk space",
  "☕ Make a cup of tea or coffee"
];

const longBreakSuggestions = [
  "🚶‍♀️ Take a 10-15 minute walk outside",
  "🍎 Prepare and eat a healthy meal or snack",
  "📖 Read a few pages of a book",
  "🧘‍♂️ Do a 10-minute meditation session",
  "📞 Call a friend or family member",
  "🧹 Tidy up your workspace or room",
  "🎨 Do a creative activity like drawing or writing",
  "🛁 Take a refreshing shower",
  "🎵 Listen to a podcast or your favorite playlist",
  "💪 Do some light exercise or yoga",
  "🌅 Step outside and get some fresh air",
  "📝 Journal about your progress or thoughts",
  "🍃 Practice gratitude - list 3 things you're thankful for",
  "🧘 Do some deep breathing exercises",
  "🎮 Play a quick game or puzzle",
  "🌱 Do some gardening or plant care",
  "🎭 Watch a funny video to boost your mood"
];

export const BreakSuggestions: React.FC<BreakSuggestionsProps> = ({ mode }) => {
  const [currentSuggestion, setCurrentSuggestion] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  const suggestions = mode === 'shortBreak' ? shortBreakSuggestions : longBreakSuggestions;

  useEffect(() => {
    // Set initial suggestion
    setCurrentSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)]);

    // Change suggestion every minute
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)]);
        setIsVisible(true);
      }, 500);
    }, 60 * 1000); // Every 1 minute

    return () => clearInterval(interval);
  }, [mode, suggestions]);

  return (
    <Card className={`mt-6 bg-white/10 backdrop-blur-md border-white/20 p-6 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-3">
          {mode === 'shortBreak' ? 'Quick Break Ideas' : 'Long Break Activities'}
        </h3>
        <div className="text-white/90 text-lg leading-relaxed">
          {currentSuggestion}
        </div>
        <p className="text-white/60 text-sm mt-2">
          New tip every minute
        </p>
      </div>
    </Card>
  );
};
