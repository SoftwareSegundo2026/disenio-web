'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type TypewriterTextProps = {
  text: string;
  className?: string;
  speedMs?: number;
  startDelayMs?: number;
};

export default function TypewriterText({
  text,
  className,
  speedMs = 90,
  startDelayMs = 250,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayedText(text);
      return;
    }

    setDisplayedText('');
    let currentIndex = 0;
    let intervalId: number | undefined;

    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        currentIndex += 1;
        setDisplayedText(text.slice(0, currentIndex));

        if (currentIndex >= text.length && intervalId) {
          window.clearInterval(intervalId);
        }
      }, speedMs);
    }, startDelayMs);

    return () => {
      window.clearTimeout(timeoutId);

      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [startDelayMs, speedMs, text]);

  const isComplete = displayedText.length >= text.length;

  return (
    <span
      className={cn(
        'inline-flex items-end motion-safe:animate-in motion-safe:fade-in motion-safe:duration-700',
        className,
      )}
    >
      <span aria-hidden="true">{displayedText}</span>
      {!isComplete ? (
        <span
          aria-hidden="true"
          className="ml-1 inline-block h-[0.9em] w-px bg-current animate-pulse"
        />
      ) : null}
      <span className="sr-only">{text}</span>
    </span>
  );
}