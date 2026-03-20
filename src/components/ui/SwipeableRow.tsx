import { useState, useRef, useCallback } from 'react';
import type { TouchEvent, ReactNode } from 'react';

interface SwipeableRowProps {
  children: ReactNode;
  onDelete: () => void;
  disabled?: boolean;
}

export function SwipeableRow({ children, onDelete, disabled }: SwipeableRowProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const startX = useRef(0);
  const startY = useRef(0);
  const isSwiping = useRef(false);
  const isScrolling = useRef(false);
  const directionLocked = useRef(false);
  const rowRef = useRef<HTMLDivElement>(null);

  const DELETE_THRESHOLD = -60;
  const MAX_SWIPE = -100;

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled || isDeleting) return;
    const touch = e.touches[0];
    startX.current = touch.clientX;
    startY.current = touch.clientY;
    isSwiping.current = false;
    isScrolling.current = false;
    directionLocked.current = false;
    setIsAnimating(false);
  }, [disabled, isDeleting]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (disabled || isDeleting) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - startX.current;
    const deltaY = touch.clientY - startY.current;

    if (!directionLocked.current) {
      if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) return;
      directionLocked.current = true;
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        isScrolling.current = true;
        return;
      }
      isSwiping.current = true;
    }

    if (isScrolling.current) return;
    if (!isSwiping.current) return;

    e.preventDefault();
    setTranslateX(Math.max(MAX_SWIPE, Math.min(0, deltaX)));
  }, [disabled, isDeleting]);

  const handleTouchEnd = useCallback(() => {
    if (disabled || isDeleting || !isSwiping.current) return;

    setIsAnimating(true);

    if (translateX < DELETE_THRESHOLD) {
      // Delete: slide off screen, collapse, then remove
      setIsDeleting(true);
      const rowWidth = rowRef.current?.offsetWidth ?? 400;
      setTranslateX(-rowWidth);

      setTimeout(() => {
        onDelete();
        // Reset state after deletion
        setTranslateX(0);
        setIsAnimating(false);
        setIsDeleting(false);
      }, 200);
    } else {
      // Snap back
      setTranslateX(0);
      setTimeout(() => setIsAnimating(false), 200);
    }
  }, [disabled, isDeleting, translateX, onDelete]);

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <div ref={rowRef} className="relative overflow-hidden">
      {/* Red delete background — revealed as row slides left (Gmail-style) */}
      <div
        className="absolute inset-0 flex items-center justify-end"
        style={{
          background: translateX < 0
            ? `linear-gradient(to left, #DC2626 ${Math.min(Math.abs(translateX) + 20, 100)}%, transparent ${Math.min(Math.abs(translateX) + 20, 100)}%)`
            : 'transparent',
        }}
      >
        {translateX < -10 && (
          <div
            className="flex items-center gap-2 pr-4 text-white"
            style={{
              opacity: Math.min(1, Math.abs(translateX) / 40),
              transition: isAnimating ? 'opacity 200ms ease-out' : 'none',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </div>
        )}
      </div>

      {/* Foreground content */}
      <div
        className="relative bg-card/60"
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isAnimating ? 'transform 200ms ease-out' : 'none',
          willChange: isSwiping.current ? 'transform' : 'auto',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}
