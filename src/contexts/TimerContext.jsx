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

  // Initialize focus mode monitoring
  useEffect(() => {
    console.log("Setting up focus mode monitoring...");
    
    // Listen for app change events from electron
    const handleAppChange = (event) => {
      console.log("App change event received:", event.detail);
      
      // Trigger focus mode check when app changes
      if (window.electron) {
        window.electron.send('check-focus-mode', {
          appName: event.detail.appName
        });
      }
    };

    // Listen for focus mode violations
    const handleFocusViolation = (event) => {
      console.log("Focus violation detected:", event.detail);
      
      // Import and use FocusModeAlert dynamically to avoid circular imports
      import('@/components/focus/FocusModeAlert.jsx').then(({ FocusModeAlert }) => {
        // Create a temporary container for the alert
        const alertContainer = document.createElement('div');
        document.body.appendChild(alertContainer);
        
        // Use React to render the alert
        import('react-dom/client').then(({ createRoot }) => {
          const root = createRoot(alertContainer);
          root.render(React.createElement(FocusModeAlert, {
            appName: event.detail.appName,
            onDismiss: () => {
              root.unmount();
              document.body.removeChild(alertContainer);
            }
          }));
        });
      });
    };

    window.addEventListener('app-changed', handleAppChange);
    window.addEventListener('focus-mode-violation', handleFocusViolation);
    
    // Start monitoring if electron is available
    if (window.electron) {
      console.log("Starting focus mode monitoring...");
      window.electron.send('start-focus-monitoring');
    }

    return () => {
      window.removeEventListener('app-changed', handleAppChange);
      window.removeEventListener('focus-mode-violation', handleFocusViolation);
      
      if (window.electron) {
        window.electron.send('stop-focus-monitoring');
      }
    };
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
  }, []);

  const pausePomodoroTimer = useCallback(() => {
    setIsPomodoroActive(false);
  }, []);

  const resetPomodoroTimer = useCallback(() => {
    setIsPomodoroActive(false);
    setIsPomodoroResting(false);
    setPomodoroTimeElapsed(0);
    setPomodoroRestProgress(0);
  }, []);

  // Eye Care Timer Controls
  const startEyeCareTimer = useCallback(() => {
    setIsEyeCareActive(true);
  }, []);

  const pauseEyeCareTimer = useCallback(() => {
    setIsEyeCareActive(false);
  }, []);

  const resetEyeCareTimer = useCallback(() => {
    setIsEyeCareActive(false);
    setIsEyeCareResting(false);
    setEyeCareTimeElapsed(0);
    setEyeCareRestProgress(0);
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
