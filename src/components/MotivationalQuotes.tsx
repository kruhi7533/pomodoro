
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

const quotes = [
  "The secret of getting ahead is getting started. - Mark Twain",
  "Focus on being productive instead of busy. - Tim Ferriss",
  "Productivity is never an accident. It is always the result of a commitment to excellence. - Paul J. Meyer",
  "You don't have to be great to get started, but you have to get started to be great. - Les Brown",
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "Success is the sum of small efforts repeated day in and day out. - Robert Collier",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "The future depends on what you do today. - Mahatma Gandhi",
  "Excellence is not a skill, it's an attitude. - Ralph Marston",
  "Progress, not perfection. - Unknown",
  "Great things never come from comfort zones. - Unknown",
  "Your limitation—it's only your imagination. - Unknown",
  "Push yourself, because no one else is going to do it for you. - Unknown",
  "Sometimes later becomes never. Do it now. - Unknown",
  "Dream it. Wish it. Do it. - Unknown"
];

export const MotivationalQuotes: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Set initial quote
    setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
        setIsVisible(true);
      }, 500);
    }, 3 * 60 * 1000); // Every 3 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={`mt-6 bg-white/10 backdrop-blur-md border-white/20 p-6 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-3">Stay Motivated</h3>
        <blockquote className="text-white/90 italic text-lg leading-relaxed">
          "{currentQuote}"
        </blockquote>
        <p className="text-white/60 text-sm mt-2">
          New quote every 3 minutes
        </p>
      </div>
    </Card>
  );
};
