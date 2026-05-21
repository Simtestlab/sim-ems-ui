"use client"

import React, { useEffect, useState } from 'react'

/**
 * The app is designed at a 1920×1080 logical canvas. ViewportScaler renders
 * that canvas and applies a uniform CSS transform so it fills the real
 * viewport — scaling up to 2× on a 3840×2160 (4K) display, or down to fit
 * smaller screens. Because the transform is uniform, every element keeps its
 * exact relative position (including the microgrid diagram nodes/lines).
 */
const DESIGN_WIDTH = 1920

export default function ViewportScaler({ children }: { children: React.ReactNode }) {
  const [dims, setDims] = useState<{ scale: number; height: number } | null>(null)

  useEffect(() => {
    const update = () => {
      const scale = window.innerWidth / DESIGN_WIDTH
      setDims({ scale, height: window.innerHeight / scale })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Before measurement (and during SSR) render the canvas at native size so
  // server and first client paint agree — avoids a hydration mismatch.
  if (!dims) {
    return <div style={{ width: '100%', height: '100%' }}>{children}</div>
  }

  return (
    <div
      style={{
        width: DESIGN_WIDTH,
        height: dims.height,
        transform: `scale(${dims.scale})`,
        transformOrigin: 'top left',
      }}
    >
      {children}
    </div>
  )
}
