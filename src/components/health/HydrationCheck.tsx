
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Droplets, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export function HydrationCheck({ className }: { className?: string }) {
  // Use localStorage to persist state across tab changes
  const [isEnabled, setIsEnabled] = useState(() => {
    const saved = localStorage.getItem("hydrationEnabled");
    return saved ? JSON.parse(saved) : false;
  });
  
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem("hydrationTimeLeft");
    return saved ? parseInt(saved) : 30 * 60;
  });
  
  const [lastUpdateTime, setLastUpdateTime] = useState(() => {
    const saved = localStorage.getItem("hydrationLastUpdate");
    return saved ? parseInt(saved) : Date.now();
  });

  // Calculate actual time left based on elapsed time since last update
  useEffect(() => {
    if (isEnabled) {
      const now = Date.now();
      const elapsed = Math.floor((now - lastUpdateTime) / 1000);
      const actualTimeLeft = Math.max(0, timeLeft - elapsed);
      
      if (actualTimeLeft !== timeLeft) {
        setTimeLeft(actualTimeLeft);
      }
    }
  }, [isEnabled, timeLeft, lastUpdateTime]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("hydrationEnabled", JSON.stringify(isEnabled));
  }, [isEnabled]);

  useEffect(() => {
    localStorage.setItem("hydrationTimeLeft", timeLeft.toString());
  }, [timeLeft]);

  useEffect(() => {
    localStorage.setItem("hydrationLastUpdate", Date.now().toString());
  }, [timeLeft]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isEnabled && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = Math.max(0, prev - 1);
          if (newTime <= 0) {
            // Time's up - show notification
            toast({
              title: "💧 Hydration Reminder",
              description: "Time to drink some water! Stay hydrated for better focus.",
              duration: 8000,
            });
            
            // Send system notification if available
            if (window.electron) {
              window.electron.send('show-native-notification', {
                title: "Hydration Reminder",
                body: "Time to drink some water! Stay hydrated for better focus."
              });
            }
            
            // Reset timer
            return 30 * 60; // Reset to 30 minutes
          }
          return newTime;
        });
        setLastUpdateTime(Date.now());
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isEnabled, timeLeft]);

  const toggleEnabled = () => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    if (newEnabled) {
      setTimeLeft(30 * 60);
      setLastUpdateTime(Date.now());
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
          <Droplets className="h-5 w-5 text-blue-500" />
          <span>Hydration Check</span>
        </CardTitle>
        <Switch checked={isEnabled} onCheckedChange={toggleEnabled} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            className={cn(
              "flex h-24 w-24 mx-auto flex-col items-center justify-center rounded-full border-4",
              isEnabled 
                ? "border-blue-300 bg-blue-50 dark:bg-blue-900/20" 
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
              ? "Reminders every 30 minutes to stay hydrated" 
              : "Enable to get hydration reminders"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
