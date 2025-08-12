import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Square, Timer } from "lucide-react";

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  workoutName: string;
  duration: number; // in minutes
  onComplete: () => void;
}

export const TimerModal = ({ isOpen, onClose, workoutName, duration, onComplete }: TimerModalProps) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // convert to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setTimeLeft(duration * 60);
    setIsRunning(false);
    setIsPaused(false);
  }, [duration, isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
    setIsPaused(false);
  };

  const progressValue = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Timer className="w-5 h-5" />
            {workoutName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-6 py-4">
          <div className="text-6xl font-bold text-primary">
            {formatTime(timeLeft)}
          </div>
          
          <Progress value={progressValue} className="h-3" />
          
          <div className="text-sm text-muted-foreground">
            {Math.floor(((duration * 60 - timeLeft) / 60))} of {duration} minutes completed
          </div>
          
          <div className="flex justify-center gap-3">
            {!isRunning && !isPaused && (
              <Button onClick={handleStart} size="lg">
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
            )}
            
            {isRunning && (
              <Button onClick={handlePause} variant="outline" size="lg">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            
            {isPaused && (
              <Button onClick={handleStart} size="lg">
                <Play className="w-4 h-4 mr-2" />
                Resume
              </Button>
            )}
            
            {(isRunning || isPaused) && (
              <Button onClick={handleStop} variant="destructive" size="lg">
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};