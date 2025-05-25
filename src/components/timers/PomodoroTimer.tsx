
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { useTimer } from '@/contexts/TimerContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function PomodoroTimer() {
  const {
    timeLeft,
    isRunning,
    currentSession,
    workTime,
    shortBreakTime,
    longBreakTime,
    sessionsUntilLongBreak,
    completedSessions,
    startTimer,
    pauseTimer,
    resetTimer,
    updateSettings
  } = useTimer();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState({
    workTime,
    shortBreakTime,
    longBreakTime,
    sessionsUntilLongBreak
  });

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionName = () => {
    switch (currentSession) {
      case 'work': return 'Work Session';
      case 'shortBreak': return 'Short Break';
      case 'longBreak': return 'Long Break';
      default: return 'Pomodoro Timer';
    }
  };

  const getSessionColor = () => {
    switch (currentSession) {
      case 'work': return 'text-red-500';
      case 'shortBreak': return 'text-green-500';
      case 'longBreak': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const handleSaveSettings = () => {
    updateSettings(tempSettings);
    setSettingsOpen(false);
  };

  // Progress calculation
  const getTotalTime = () => {
    switch (currentSession) {
      case 'work': return workTime;
      case 'shortBreak': return shortBreakTime;
      case 'longBreak': return longBreakTime;
      default: return workTime;
    }
  };

  const progress = ((getTotalTime() - timeLeft) / getTotalTime()) * 100;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-between">
          <span className={getSessionColor()}>{getSessionName()}</span>
          <Popover open={settingsOpen} onOpenChange={setSettingsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Timer Settings</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="work-time">Work Time (minutes)</Label>
                  <Input
                    id="work-time"
                    type="number"
                    value={tempSettings.workTime / 60}
                    onChange={(e) => setTempSettings(prev => ({
                      ...prev,
                      workTime: parseInt(e.target.value) * 60 || 1500
                    }))}
                    min="1"
                    max="60"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short-break">Short Break (minutes)</Label>
                  <Input
                    id="short-break"
                    type="number"
                    value={tempSettings.shortBreakTime / 60}
                    onChange={(e) => setTempSettings(prev => ({
                      ...prev,
                      shortBreakTime: parseInt(e.target.value) * 60 || 300
                    }))}
                    min="1"
                    max="30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="long-break">Long Break (minutes)</Label>
                  <Input
                    id="long-break"
                    type="number"
                    value={tempSettings.longBreakTime / 60}
                    onChange={(e) => setTempSettings(prev => ({
                      ...prev,
                      longBreakTime: parseInt(e.target.value) * 60 || 900
                    }))}
                    min="1"
                    max="60"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessions-until-long">Sessions until Long Break</Label>
                  <Input
                    id="sessions-until-long"
                    type="number"
                    value={tempSettings.sessionsUntilLongBreak}
                    onChange={(e) => setTempSettings(prev => ({
                      ...prev,
                      sessionsUntilLongBreak: parseInt(e.target.value) || 4
                    }))}
                    min="2"
                    max="10"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveSettings} className="flex-1">
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setTempSettings({
                        workTime,
                        shortBreakTime,
                        longBreakTime,
                        sessionsUntilLongBreak
                      });
                      setSettingsOpen(false);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </CardTitle>
        <CardDescription>
          Session {completedSessions + 1} • {completedSessions} completed
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress Ring */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                strokeWidth="8"
                fill="none"
                className="stroke-muted"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                strokeWidth="8"
                fill="none"
                className={`transition-all duration-1000 ease-in-out ${
                  currentSession === 'work' ? 'stroke-red-500' :
                  currentSession === 'shortBreak' ? 'stroke-green-500' :
                  'stroke-blue-500'
                }`}
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
              />
            </svg>
            
            {/* Timer display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-mono font-bold">
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2 justify-center">
          <Button
            onClick={isRunning ? pauseTimer : startTimer}
            size="lg"
            className="flex items-center gap-2"
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          
          <Button
            onClick={resetTimer}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
