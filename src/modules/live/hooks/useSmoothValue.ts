'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Smoothly interpolates a value using requestAnimationFrame
 * This prevents SVG path distortion by animating numerical values
 * instead of relying on CSS transitions
 * 
 * @param targetValue - The target value to interpolate towards
 * @param speed - Interpolation speed (0-1, default 0.1)
 * @returns Smoothly interpolated current value
 */
export function useSmoothValue(targetValue: number, speed: number = 0.1): number {
  const [currentValue, setCurrentValue] = useState(targetValue);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const currentValueRef = useRef(targetValue);

  useEffect(() => {
    currentValueRef.current = currentValue;
  }, [currentValue]);

  useEffect(() => {
    const animate = () => {
      const current = currentValueRef.current;
      const target = targetValue;
      
      // Linear interpolation (lerp) with easing
      const newValue = current + (target - current) * speed;
      
      // Stop animating when close enough to target (threshold: 0.01)
      if (Math.abs(target - newValue) > 0.01) {
        setCurrentValue(newValue);
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentValue(target);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetValue, speed]);

  return currentValue;
}
