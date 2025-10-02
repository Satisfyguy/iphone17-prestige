import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LaunchOfferUtils } from '@/lib/launch-offer';

interface ReservationTimerProps {
  expiresAt: number;
  onExpired?: () => void;
}

export const ReservationTimer = ({ expiresAt, onExpired }: ReservationTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setTimeRemaining(remaining);
      
      if (remaining <= 0 && !isExpired) {
        setIsExpired(true);
        onExpired?.();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, isExpired, onExpired]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isExpired) {
    return (
      <Badge variant="destructive" className="text-sm">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Réservation expirée
      </Badge>
    );
  }

  const isUrgent = timeRemaining <= 60; // Moins d'une minute

  return (
    <Badge 
      variant={isUrgent ? "destructive" : "secondary"} 
      className={`text-sm ${isUrgent ? 'animate-pulse' : ''}`}
    >
      <Clock className="h-3 w-3 mr-1" />
      Réservé {formatTime(timeRemaining)}
    </Badge>
  );
};
