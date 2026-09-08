import { useState } from 'react'
import type { CSSProperties } from 'react'

interface BodyThumbProps {
  src?: string
  alt: string
  className?: string
  style?: CSSProperties
  fallbackBackground: string
  boxShadow?: string
  borderColor?: string
}

export function BodyThumb({ src, alt, className, style, fallbackBackground, boxShadow, borderColor }: BodyThumbProps) {
  const [failed, setFailed] = useState(false)
  const glow = borderColor || fallbackBackground

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`rounded-full object-cover ${className ?? ''}`}
        style={{ boxShadow: boxShadow ?? `0 0 30px ${glow}22`, border: `1px solid ${glow}44`, ...style }}
      />
    )
  }

  return (
    <div
      className={`rounded-full ${className ?? ''}`}
      style={{
        background: `radial-gradient(circle at 35% 35%, ${fallbackBackground}, ${fallbackBackground}88, ${fallbackBackground}44)`,
        boxShadow: boxShadow ?? `0 0 30px ${glow}22`,
        border: `1px solid ${glow}44`,
        ...style,
      }}
    />
  )
}