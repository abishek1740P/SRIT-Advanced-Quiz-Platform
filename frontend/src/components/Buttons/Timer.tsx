import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  initialSeconds: number;
  onTimeUp?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function Timer({ initialSeconds, onTimeUp, size = 'md' }: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) {
      onTimeUp?.();
      return;
    }

    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, onTimeUp]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const isWarning = seconds <= 300 && seconds > 120;
  const isCritical = seconds <= 120;

  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-5xl'
  };

  return (
    <div 
      className={`flex items-center gap-2 font-mono font-bold ${
        isCritical ? 'text-violation animate-pulse' : 
        isWarning ? 'text-warning' : 
        'text-success'
      }`}
      data-testid="timer-display"
    >
      <Clock className={`h-${size === 'sm' ? '5' : size === 'md' ? '6' : '8'} w-${size === 'sm' ? '5' : size === 'md' ? '6' : '8'}`} />
      <span className={sizeClasses[size]}>{timeString}</span>
    </div>
  );
}
