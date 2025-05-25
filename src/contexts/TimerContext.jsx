
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

const TimerContext = createContext(undefined);

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
};

export const TimerProvider = ({ children }) => {
  // Pomodoro Timer State
  const [pomodoroTimeElapsed, setPomodoroTimeElapsed] = useState(0);
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const [isPomodoroResting, setIsPomodoroResting] = useState(false);
  const [pomodoroRestProgress, setPomodoroRestProgress] = useState(0);
  const [pomodoroWorkDuration] = useState(25 * 60); // 25 minutes
  const [pomodoroRestDuration] = useState(5 * 60); // 5 minutes

  // Eye Care Timer State
  const [eyeCareTimeElapsed, setEyeCareTimeElapsed] = useState(0);
  const [isEyeCareActive, setIsEyeCareActive] = useState(false);
  const [isEyeCareResting, setIsEyeCareResting] = useState(false);
  const [eyeCareRestProgress, setEyeCareRestProgress] = useState(0);
  const [eyeCareWorkDuration] = useState(20 * 60); // 20 minutes
  const [eyeCareRestDuration] = useState(20); // 20 seconds

  // Auto-start timers on mount
  useEffect(() => {
    const autoStart = setTimeout(() => {
      setIsPomodoroActive(true);
      setIsEyeCareActive(true);
      console.log("Auto-started Pomodoro and Eye Care timers");
    }, 1000);

    return () => clearTimeout(autoStart);
  }, []);

  // Pomodoro Timer Effect
  useEffect(() => {
    let interval = null;

    if (isPomodoroActive) {
      interval = setInterval(() => {
        if (isPomodoroResting) {
          setPomodoroTimeElapsed((prev) => {
            const newTime = prev + 1;
            setPomodoroRestProgress(((pomodoroRestDuration - newTime) / pomodoroRestDuration) * 100);

            if (newTime >= pomodoroRestDuration) {
              setIsPomodoroResting(false);
              return 0;
            }
            return newTime;
          });
        } else {
          setPomodoroTimeElapsed((prev) => {
            const newTime = prev + 1;

            if (newTime >= pomodoroWorkDuration) {
              setIsPomodoroResting(true);
              return 0;
            }
            return newTime;
          });
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPomodoroActive, isPomodoroResting, pomodoroWorkDuration, pomodoroRestDuration]);

  // Eye Care Timer Effect
  useEffect(() => {
    let interval = null;

    if (isEyeCareActive) {
      interval = setInterval(() => {
        if (isEyeCareResting) {
          setEyeCareTimeElapsed((prev) => {
            const newTime = prev + 1;
            setEyeCareRestProgress(((eyeCareRestDuration - newTime) / eyeCareRestDuration) * 100);

            if (newTime >= eyeCareRestDuration) {
              setIsEyeCareResting(false);
              return 0;
            }
            return newTime;
          });
        } else {
          setEyeCareTimeElapsed((prev) => {
            const newTime = prev + 1;

            if (newTime >= eyeCareWorkDuration) {
              setIsEyeCareResting(true);
              return 0;
            }
            return newTime;
          });
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isEyeCareActive, isEyeCareResting, eyeCareWorkDuration, eyeCareRestDuration]);

  // Pomodoro Timer Controls
  const startPomodoroTimer = useCallback(() => {
    setIsPomodoroActive(true);
    // Removed toast notification
  }, []);

  const pausePomodoroTimer = useCallback(() => {
    setIsPomodoroActive(false);
    // Removed toast notification
  }, []);

  const resetPomodoroTimer = useCallback(() => {
    setIsPomodoroActive(false);
    setIsPomodoroResting(false);
    setPomodoroTimeElapsed(0);
    setPomodoroRestProgress(0);
    // Removed toast notification
  }, []);

  // Eye Care Timer Controls
  const startEyeCareTimer = useCallback(() => {
    setIsEyeCareActive(true);
    // Removed toast notification
  }, []);

  const pauseEyeCareTimer = useCallback(() => {
    setIsEyeCareActive(false);
    // Removed toast notification
  }, []);

  const resetEyeCareTimer = useCallback(() => {
    setIsEyeCareActive(false);
    setIsEyeCareResting(false);
    setEyeCareTimeElapsed(0);
    setEyeCareRestProgress(0);
    // Removed toast notification
  }, []);

  const contextValue = {
    // Pomodoro Timer
    pomodoroTimeElapsed,
    isPomodoroActive,
    isPomodoroResting,
    pomodoroRestProgress,
    pomodoroWorkDuration,
    pomodoroRestDuration,
    startPomodoroTimer,
    pausePomodoroTimer,
    resetPomodoroTimer,

    // Eye Care Timer
    eyeCareTimeElapsed,
    isEyeCareActive,
    isEyeCareResting,
    eyeCareRestProgress,
    eyeCareWorkDuration,
    eyeCareRestDuration,
    startEyeCareTimer,
    pauseEyeCareTimer,
    resetEyeCareTimer,
  };

  return (
    <TimerContext.Provider value={contextValue}>
      {children}
    </TimerContext.Provider>
  );
};
