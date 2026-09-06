import { useState, useCallback, useRef, useEffect } from 'react';
import { triggerHaptic, HapticPattern } from './haptics';

export function useCalculationFeedback() {
  const [isCalculated, setIsCalculated] = useState(false);
  const [calculationKey, setCalculationKey] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const triggerFeedback = useCallback((pattern: HapticPattern = 'calculate') => {
    triggerHaptic(pattern);
    setCalculationKey((prev) => prev + 1);
    setIsCalculated(true);

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setIsCalculated(false);
    }, 700);
  }, []);

  const triggerReset = useCallback(() => {
    triggerHaptic('reset');
    setIsCalculated(false);
  }, []);

  const triggerError = useCallback(() => {
    triggerHaptic('error');
    setIsCalculated(false);
  }, []);

  return {
    isCalculated,
    calculationKey,
    triggerFeedback,
    triggerReset,
    triggerError,
  };
}
