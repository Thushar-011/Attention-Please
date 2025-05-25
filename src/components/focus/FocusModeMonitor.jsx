
import { useEffect } from 'react';
import { useFocusMode } from '@/contexts/FocusModeContext';
import { FocusModeAlert } from './FocusModeAlert.jsx';

export function FocusModeMonitor() {
  const { isFocusMode, isCurrentAppWhitelisted, currentActiveApp } = useFocusMode();

  useEffect(() => {
    let alertShown = false;
    let lastApp = null;

    const checkFocusMode = () => {
      if (!isFocusMode || !currentActiveApp) {
        alertShown = false;
        return;
      }

      // If app changed, reset alert flag
      if (lastApp !== currentActiveApp) {
        alertShown = false;
        lastApp = currentActiveApp;
      }

      // Show alert if app is not whitelisted and we haven't shown it yet
      if (!isCurrentAppWhitelisted && !alertShown) {
        console.log('Focus mode violation detected for:', currentActiveApp);
        
        // Dispatch focus mode violation event
        const violationEvent = new CustomEvent('focus-mode-violation', {
          detail: {
            appName: currentActiveApp,
            timestamp: Date.now()
          }
        });
        window.dispatchEvent(violationEvent);
        
        alertShown = true;
      }
    };

    // Check focus mode every second
    const interval = setInterval(checkFocusMode, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isFocusMode, isCurrentAppWhitelisted, currentActiveApp]);

  return null; // This component doesn't render anything
}
