import { useState, useEffect, useCallback, RefObject } from 'react';

// ============================================
// ACCESSIBILITY HOOK
// Provides reduced motion detection, focus management,
// and keyboard navigation utilities
// ============================================

export interface AccessibilityState {
  reducedMotion: boolean;
  highContrast: boolean;
  screenReaderActive: boolean;
}

/**
 * Main accessibility hook - detects system preferences
 */
export function useAccessibility(): AccessibilityState {
  const [state, setState] = useState<AccessibilityState>({
    reducedMotion: false,
    highContrast: false,
    screenReaderActive: false,
  });

  useEffect(() => {
    // Detect prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: more)');

    const updateState = () => {
      setState({
        reducedMotion: motionQuery.matches,
        highContrast: contrastQuery.matches,
        screenReaderActive: false, // Can't reliably detect this
      });
    };

    updateState();

    // Listen for changes
    motionQuery.addEventListener('change', updateState);
    contrastQuery.addEventListener('change', updateState);

    return () => {
      motionQuery.removeEventListener('change', updateState);
      contrastQuery.removeEventListener('change', updateState);
    };
  }, []);

  return state;
}

/**
 * Focus trap hook - traps focus within a container
 * Use for modals and dialogs
 */
export function useFocusTrap(
  isActive: boolean,
  containerRef: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const getFocusableElements = () =>
      Array.from(container.querySelectorAll<HTMLElement>(focusableSelector))
        .filter(el => !el.hasAttribute('disabled'));

    // Focus first element on activation
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, containerRef]);
}

/**
 * Focus restoration hook - saves and restores focus
 * Use when opening/closing modals
 */
export function useFocusRestore() {
  const previousFocusRef = { current: null as HTMLElement | null };

  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, []);

  return { saveFocus, restoreFocus };
}

/**
 * Arrow key navigation for option grids
 */
export function useArrowNavigation(
  containerRef: RefObject<HTMLElement | null>,
  columns: number = 2
) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!containerRef.current) return;

      const buttons = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>('button:not([disabled])')
      );
      const currentIndex = buttons.indexOf(document.activeElement as HTMLElement);

      if (currentIndex === -1) return;

      let nextIndex = currentIndex;

      switch (e.key) {
        case 'ArrowRight':
          nextIndex = Math.min(currentIndex + 1, buttons.length - 1);
          break;
        case 'ArrowLeft':
          nextIndex = Math.max(currentIndex - 1, 0);
          break;
        case 'ArrowDown':
          nextIndex = Math.min(currentIndex + columns, buttons.length - 1);
          break;
        case 'ArrowUp':
          nextIndex = Math.max(currentIndex - columns, 0);
          break;
        default:
          return;
      }

      if (nextIndex !== currentIndex) {
        e.preventDefault();
        buttons[nextIndex].focus();
      }
    },
    [containerRef, columns]
  );

  return handleKeyDown;
}

/**
 * Get animation variants based on reduced motion preference
 */
export function getMotionVariants(reducedMotion: boolean) {
  if (reducedMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.15 },
    };
  }

  return {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -20 },
    transition: { type: 'spring', damping: 15 },
  };
}

/**
 * Simplified spring transition for reduced motion
 */
export function getSpringTransition(reducedMotion: boolean) {
  if (reducedMotion) {
    return { duration: 0.15 };
  }
  return { type: 'spring', damping: 15 };
}

export default useAccessibility;
