/**
 * Haptic Feedback and Sensory Utility for Mobile Devices
 * Uses navigator.vibrate with safe feature detection and fallback
 */

export type HapticPattern =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'tap'
  | 'success'
  | 'calculate'
  | 'reset'
  | 'error'
  | 'selection';

export function triggerHaptic(pattern: HapticPattern = 'light'): void {
  if (typeof window === 'undefined' || !('navigator' in window) || !navigator.vibrate) {
    return;
  }

  try {
    switch (pattern) {
      case 'tap':
      case 'light':
      case 'selection':
        // Extremely crisp, subtle tap (10ms)
        navigator.vibrate(10);
        break;

      case 'medium':
        // Tactile button click confirmation (18ms)
        navigator.vibrate(18);
        break;

      case 'heavy':
        navigator.vibrate(30);
        break;

      case 'calculate':
      case 'success':
        // Distinct subtle double-pulse confirmation when calculation completes
        navigator.vibrate([15, 35, 20]);
        break;

      case 'reset':
        // Soft single buzz for resetting form (12ms)
        navigator.vibrate(12);
        break;

      case 'error':
        // Gentle double-warning buzz for invalid inputs (25ms - 40ms - 25ms)
        navigator.vibrate([25, 40, 25]);
        break;

      default:
        navigator.vibrate(15);
        break;
    }
  } catch {
    // Fail silently in browsers where vibration is restricted or rejected
  }
}
