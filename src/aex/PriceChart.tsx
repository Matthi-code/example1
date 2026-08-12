import { useMemo, useRef, useState, useEffect, useCallback } from 'react'
import type { DailyPoint } from './data'
import { dayToDate, formatDate } from './data'

interface Props {
  points: DailyPoint[]
  height?: number
  currencySymbol?: string
  /** true = colour as gain (green), false = loss (red) */
  up: boolean
  showAxis?: boolean
}

const PAD = { top: 16, right: 14, bottom: 26, left: 52 }

function niceTicks(min: number, max: number, count = 4): number[] {
  if (min === max) return [min]
  const span = max - min
  const step = Math.pow(10, Math.floor(Math.log10(span / count)))
  const err = (span / count) / step
  const mult = err >= 7.5 ? 10 : err >= 3.5 ? 5 : err >= 1.5 ? 2 : 1
  const niceStep = mult * step
  const start = Math.ceil(min / niceStep) * niceStep
  const ticks: number[] = []
  for (let v = start; v <= max + 1e-9; v += niceStep) ticks.push(v)
  return ticks
}

export default function PriceChart({
  points,
  height = 300,
  currencySymbol = '€',
  up,
  showAxis = true,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(720)
  const [hover, setHover] = useState<number | null>(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width
      if (w) setWidth(w)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const geo = useMemo(() => {
    const w = Math.max(width, 240)
    const plotW = w - PAD.left - PAD.right
    const plotH = height - PAD.top - PAD.bottom
    const closes = points.map((p) => p[1])
    let min = Math.min(...closes)
    let max = Math.max(...closes)
    if (min === max) {
      min -= 1
      max += 1
    }
    const pad = (max - min) * 0.08
    min -= pad
    max += pad
    const n = points.length
    const x = (i: number) => PAD.left + (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW)
    const y = (v: number) => PAD.top + plotH - ((v - min) / (max - min)) * plotH
    const linePts = points.map((p, i) => `${x(i)},${y(p[1])}`).join(' ')
    const areaPts = `${PAD.left},${PAD.top + plotH} ${linePts} ${PAD.left + plotW},${PAD.top + plotH}`
    const ticks = niceTicks(min + pad, max - pad, 4)
    return { w, plotW, plotH, min, max, x, y, linePts, areaPts, ticks, n }
  }, [points, width, height])

  const onMove = useCallback(
    (e: React.PointerEvent<SVGRectElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const px = e.clientX - rect.left
      const frac = Math.max(0, Math.min(1, (px - PAD.left) / geo.plotW))
      const idx = Math.round(frac * (geo.n - 1))
      setHover(Math.max(0, Math.min(geo.n - 1, idx)))
    },
    [geo.plotW, geo.n],
  )

  const color = up ? 'var(--up)' : 'var(--down)'
  const gradId = up ? 'grad-up' : 'grad-down'
  const startVal = points[0]?.[1] ?? 0
  const startY = geo.y(startVal)

  const hi = hover != null ? points[hover] : null
  const hiX = hover != null ? geo.x(hover) : 0
  const hiY = hi ? geo.y(hi[1]) : 0
  const tipLeft = Math.max(8, Math.min(geo.w - 132, hiX - 66))
  const tipAbove = hiY > 70

  // x date labels
  const labelIdx = geo.n <= 1 ? [0] : [0, Math.floor((geo.n - 1) / 2), geo.n - 1]

  return (
    <div className="chart-wrap" ref={wrapRef} style={{ height }}>
      <svg width={geo.w} height={height} role="img" className="price-chart">
        <defs>
          <linearGradient id="grad-up" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--up)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--up)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="grad-down" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--down)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--down)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* gridlines + y labels */}
        {showAxis &&
          geo.ticks.map((t) => (
            <g key={t}>
              <line
                x1={PAD.left}
                x2={geo.w - PAD.right}
                y1={geo.y(t)}
                y2={geo.y(t)}
                className="grid-line"
              />
              <text x={PAD.left - 8} y={geo.y(t) + 3} className="axis-label" textAnchor="end">
                {t.toLocaleString('nl-NL', { maximumFractionDigits: t < 10 ? 2 : t < 100 ? 1 : 0 })}
              </text>
            </g>
          ))}

        {/* start-of-range reference */}
        <line
          x1={PAD.left}
          x2={geo.w - PAD.right}
          y1={startY}
          y2={startY}
          className="ref-line"
        />

        <polygon points={geo.areaPts} fill={`url(#${gradId})`} />
        <polyline points={geo.linePts} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {/* x date labels */}
        {showAxis &&
          labelIdx.map((i, k) => (
            <text
              key={i}
              x={geo.x(i)}
              y={height - 8}
              className="axis-label"
              textAnchor={k === 0 ? 'start' : k === labelIdx.length - 1 ? 'end' : 'middle'}
            >
              {formatDate(dayToDate(points[i][0]), geo.n > 60)}
            </text>
          ))}

        {/* hover crosshair */}
        {hi && (
          <g>
            <line x1={hiX} x2={hiX} y1={PAD.top} y2={PAD.top + geo.plotH} className="cross-line" />
            <circle cx={hiX} cy={hiY} r={4.5} fill={color} stroke="var(--surface-1)" strokeWidth={2} />
          </g>
        )}

        {/* hover capture */}
        <rect
          x={PAD.left}
          y={PAD.top}
          width={Math.max(1, geo.plotW)}
          height={geo.plotH}
          fill="transparent"
          style={{ cursor: 'crosshair' }}
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
        />
      </svg>

      {hi && (
        <div
          className="chart-tip"
          style={{ left: tipLeft, top: tipAbove ? hiY - 58 : hiY + 14 }}
        >
          <div className="chart-tip-date">{formatDate(dayToDate(hi[0]))}</div>
          <div className="chart-tip-price">
            {currencySymbol} {hi[1].toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      )}
    </div>
  )
}
