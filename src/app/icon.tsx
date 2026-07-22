import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: 'linear-gradient(135deg, #0a0e1a 0%, #0d1530 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Glow effect */}
        <div
          style={{
            position: 'absolute',
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,212,255,0.25) 0%, transparent 70%)',
          }}
        />
        {/* TD text */}
        <span
          style={{
            fontSize: 16,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #00d4ff, #0066ff)',
            backgroundClip: 'text',
            color: 'transparent',
            letterSpacing: '-0.5px',
            fontFamily: 'Arial Black, sans-serif',
          }}
        >
          TD
        </span>
      </div>
    ),
    { ...size }
  )
}
