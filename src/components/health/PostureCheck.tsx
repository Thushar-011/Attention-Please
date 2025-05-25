
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export function PostureCheck({ className }: { className?: string }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes default
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isEnabled && isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time's up - show notification
            toast({
              title: "🧘 Posture Reminder",
              description: "Time to check your posture! Sit up straight and stretch a bit.",
              duration: 8000,
            });
            
            // Send system notification if available
            if (window.electron) {
              window.electron.send('show-native-notification', {
                title: "Posture Reminder",
                body: "Time to check your posture! Sit up straight and stretch a bit."
              });
            }
            
            // Reset timer
            return 45 * 60; // Reset to 45 minutes
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isEnabled, isActive, timeLeft]);

  const toggleEnabled = () => {
    setIsEnabled(!isEnabled);
    if (!isEnabled) {
      setIsActive(true);
      setTimeLeft(45 * 60);
    } else {
      setIsActive(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-green-500" />
          <span>Posture Check</span>
        </CardTitle>
        <Switch checked={isEnabled} onCheckedChange={toggleEnabled} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            className={cn(
              "flex h-24 w-24 mx-auto flex-col items-center justify-center rounded-full border-4",
              isEnabled 
                ? "border-green-300 bg-green-50 dark:bg-green-900/20" 
                : "border-gray-300 bg-gray-50 dark:bg-gray-900/20"
            )}
          >
            {isEnabled ? (
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-sm font-semibold">Next reminder</span>
                <span className="text-xs font-bold bg-background/80 px-2 py-0.5 rounded-full">
                  {formatTime(timeLeft)}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-sm text-muted-foreground">Disabled</span>
              </div>
            )}
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            {isEnabled 
              ? "Reminders every 45 minutes to check posture" 
              : "Enable to get posture reminders"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
