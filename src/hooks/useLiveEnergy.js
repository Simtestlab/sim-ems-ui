import { useEffect, useRef, useState } from 'react';

// Hook that provides live energy values.
// If REACT_APP_WS_URL is set, it will try to connect to that WebSocket
// that should emit JSON objects like: { solar: 1.2, load: 3.4, battery: 0.5, grid: 0 }
// Otherwise it runs a local simulator that nudges values every second.
export default function useLiveEnergy(initial = { solar: 2.2, load: 4.4, battery: 3, grid: 2, soc: 67 }) {
  const [values, setValues] = useState(initial);
  const wsRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const wsUrl = process.env.REACT_APP_WS_URL;

    if (wsUrl) {
      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;
        ws.onmessage = (ev) => {
          try {
            const data = JSON.parse(ev.data);
            setValues((prev) => ({ ...prev, ...data }));
          } catch (e) {
            // ignore malformed
          }
        };
        ws.onopen = () => console.info('Live energy WS connected');
        ws.onclose = () => console.info('Live energy WS closed');
      } catch (e) {
        console.warn('Failed to connect WebSocket', e);
      }
      return () => {
        if (wsRef.current) wsRef.current.close();
      };
    }

    // Simulator: gently vary values around initial and SOC
    timerRef.current = setInterval(() => {
      setValues((prev) => {
        const jitter = (v, amount = 0.4) => Math.max(0, +(v + (Math.random() - 0.5) * amount).toFixed(2));
        const socJitter = (s) => Math.min(100, Math.max(0, +(s + (Math.random() - 0.5) * 2).toFixed(1)));

        // simple SOC evolution: slightly trend up if battery > 0.5, else trend down
        const nextSoc = socJitter(prev.soc + (prev.battery > 0.2 ? 0.3 : -0.1));

        return {
          solar: jitter(prev.solar, 0.5),
          load: jitter(prev.load, 0.6),
          battery: jitter(prev.battery, 0.4),
          grid: jitter(prev.grid, 0.3),
          soc: nextSoc
        };
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return values;
}
