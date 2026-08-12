import { useMemo } from 'react'
import type { DailyPoint } from './data'

interface Props {
  points: DailyPoint[]
  up: boolean
  width?: number
  height?: number
  fill?: boolean
  strokeWidth?: number
}

export default function Sparkline({
  points,
  up,
  width = 120,
  height = 34,
  fill = true,
  strokeWidth = 1.6,
}: Props) {
  const { line, area } = useMemo(() => {
    if (points.length === 0) return { line: '', area: '' }
    const closes = points.map((p) => p[1])
    let min = Math.min(...closes)
    let max = Math.max(...closes)
    if (min === max) {
      min -= 1
      max += 1
    }
    const pad = strokeWidth + 1
    const n = points.length
    const x = (i: number) => (n <= 1 ? width / 2 : (i / (n - 1)) * width)
    const y = (v: number) => pad + (1 - (v - min) / (max - min)) * (height - pad * 2)
    const line = points.map((p, i) => `${x(i).toFixed(1)},${y(p[1]).toFixed(1)}`).join(' ')
    const area = `0,${height} ${line} ${width},${height}`
    return { line, area }
  }, [points, width, height, strokeWidth])

  const color = up ? 'var(--up)' : 'var(--down)'
  const gid = up ? 'spark-up' : 'spark-down'

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="sparkline"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <polygon points={area} fill={`url(#${gid})`} />}
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
