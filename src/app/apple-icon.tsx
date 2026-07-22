import { ImageResponse } from 'next/og'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: 'linear-gradient(135deg, #0a0e1a 0%, #0d1530 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Corner accents */}
        <div style={{ position: 'absolute', top: 12, left: 12, width: 28, height: 2, background: '#00d4ff', opacity: 0.5 }} />
        <div style={{ position: 'absolute', top: 12, left: 12, width: 2, height: 28, background: '#00d4ff', opacity: 0.5 }} />
        <div style={{ position: 'absolute', top: 12, right: 12, width: 28, height: 2, background: '#00d4ff', opacity: 0.5 }} />
        <div style={{ position: 'absolute', top: 12, right: 12, width: 2, height: 28, background: '#00d4ff', opacity: 0.5 }} />
        <div style={{ position: 'absolute', bottom: 12, left: 12, width: 28, height: 2, background: '#00d4ff', opacity: 0.5 }} />
        <div style={{ position: 'absolute', bottom: 12, left: 12, width: 2, height: 28, background: '#00d4ff', opacity: 0.5 }} />
        <div style={{ position: 'absolute', bottom: 12, right: 12, width: 28, height: 2, background: '#00d4ff', opacity: 0.5 }} />
        <div style={{ position: 'absolute', bottom: 12, right: 12, width: 2, height: 28, background: '#00d4ff', opacity: 0.5 }} />

        {/* Glow effect */}
        <div
          style={{
            position: 'absolute',
            width: 130,
            height: 130,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,212,255,0.2) 0%, transparent 70%)',
          }}
        />

        {/* TD text */}
        <span
          style={{
            fontSize: 88,
            fontWeight: 900,
            color: '#00d4ff',
            letterSpacing: '-3px',
            fontFamily: 'Arial Black, sans-serif',
          }}
        >
          TD
        </span>

        {/* Bottom accent line */}
        <div style={{ position: 'absolute', bottom: 32, left: 30, right: 30, height: 1, background: 'rgba(0,212,255,0.3)' }} />
      </div>
    ),
    { ...size }
  )
}
