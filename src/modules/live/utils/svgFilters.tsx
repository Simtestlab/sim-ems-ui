/**
 * SVG filter definitions for visual effects used in the RadialEnergyMonitor
 */

export function getSvgFilterDefs(): React.ReactElement {
  return (
    <defs>
      {/* Colored glow filter for luminescent effects */}
      <filter id="colored-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>

      {/* Hub glow filter for the central core */}
      <filter id="hub-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.1)" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Glassmorphism filter */}
      <filter id="glass">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
        <feOffset dx="0" dy="1" result="offset" />
        <feFlood floodColor="rgba(255,255,255,0.2)" />
        <feComposite in2="offset" operator="atop" />
      </filter>
    </defs>
  );
}