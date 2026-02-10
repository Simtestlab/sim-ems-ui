import { CSSProperties } from 'react';
import { calculateAnimationDuration, isFlowSignificant } from './svgHelpers';

/**
 * Configuration for flow animation properties
 */
export interface FlowAnimationConfig {
  animationPlayState?: 'paused' | 'running';
  animationName?: string;
  animationDuration?: string;
  animationTimingFunction?: string;
  animationIterationCount?: string;
  animationDirection?: string;
}

/**
 * Calculates flow animation properties based on energy value and direction
 */
export function getFlowAnimation(
  value: number,
  isActive: boolean,
  isFlowingOutward: boolean
): CSSProperties {
  if (!isActive || !isFlowSignificant(value)) {
    return {
      animationPlayState: 'paused'
    };
  }

  const duration = calculateAnimationDuration(value);
  const direction = 'normal';

  return {
    animationName: 'dash-move',
    animationDuration: `${duration}s`,
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationDirection: direction,
    animationPlayState: 'running'
  };
}

/**
 * Gets the CSS styles object for flow animations
 */
export function getFlowAnimationStyles(): string {
  return `
    @keyframes dash-move {
      0% { 
        stroke-dashoffset: 0;
      }
      100% { 
        stroke-dashoffset: -24;
      }
    }
    
    .solar-flow-animation {
      animation: dash-move 2s linear infinite;
    }
    
    @keyframes breathing-opacity {
      0% { 
        opacity: 0.8;
      }
      50% { 
        opacity: 1;
      }
      100% { 
        opacity: 0.8;
      }
    }
  `;
}