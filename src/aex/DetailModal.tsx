import { useEffect, useMemo, useState } from 'react'
import PriceChart from './PriceChart'
import type { Stock, IndexData, RangeKey } from './data'
import {
  RANGES,
  sliceRange,
  formatPct,
  formatPrice,
  dayToDate,
  formatDate,
} from './data'

interface Props {
  stock: Stock | IndexData
  isIndex?: boolean
  onClose: () => void
}

export default function DetailModal({ stock, isIndex = false, onClose }: Props) {
  const [range, setRange] = useState<RangeKey>('3m')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const currency = (stock as Stock).currency ?? 'EUR'
  const symbol = isIndex ? '' : currency === 'USD' ? '$' : '€'

  const view = useMemo(() => {
    const def = RANGES.find((r) => r.key === range)!
    const pts = sliceRange(stock.daily, def.days)
    const first = pts[0]?.[1] ?? stock.price
    const last = pts[pts.length - 1]?.[1] ?? stock.price
    const chg = first ? ((last - first) / first) * 100 : 0
    const closes = pts.map((p) => p[1])
    const hi = Math.max(...closes)
    const lo = Math.min(...closes)
    const startDate = pts.length ? formatDate(dayToDate(pts[0][0])) : ''
    return { pts, chg, up: chg >= 0, hi, lo, startDate }
  }, [stock, range])

  const quick: { label: string; v: number | null }[] = [
    { label: '24u', v: stock.chg24 },
    { label: '1 wk', v: stock.chg1w },
    { label: '2 wkn', v: stock.chg2w },
    { label: '3 mnd', v: stock.chg3m },
    { label: '1 jr', v: stock.chg1y },
    { label: '5 jr', v: stock.chg5y },
  ]

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Koersdetails ${stock.name}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Sluiten">
          ✕
        </button>

        <div className="modal-head">
          <div>
            <div className="modal-title-row">
              <h2>{stock.name}</h2>
              {!isIndex && <span className="ticker-pill">{stock.sym}</span>}
            </div>
            {!isIndex && <div className="modal-sector">{(stock as Stock).sector}</div>}
          </div>
          <div className="modal-price">
            <div className="modal-price-val">
              {isIndex
                ? stock.price.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : formatPrice(stock.price, currency)}
            </div>
            <div className={`delta ${(stock.chg24 ?? 0) >= 0 ? 'pos' : 'neg'}`}>
              {(stock.chg24 ?? 0) >= 0 ? '▲' : '▼'} {formatPct(stock.chg24)} <span className="delta-sub">24u</span>
            </div>
          </div>
        </div>

        <div className="range-tabs" role="tablist" aria-label="Periode">
          {RANGES.map((r) => (
            <button
              key={r.key}
              role="tab"
              aria-selected={range === r.key}
              className={`range-tab ${range === r.key ? 'active' : ''}`}
              onClick={() => setRange(r.key)}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="modal-chart-meta">
          <span className={`range-chg ${view.up ? 'pos' : 'neg'}`}>
            {view.up ? '▲' : '▼'} {formatPct(view.chg)}
          </span>
          <span className="range-since">sinds {view.startDate}</span>
        </div>

        <PriceChart points={view.pts} up={view.up} currencySymbol={symbol} height={320} />

        <div className="stat-grid">
          <div className="stat-cell">
            <div className="stat-cell-label">Periode hoog</div>
            <div className="stat-cell-val">
              {isIndex ? view.hi.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : formatPrice(view.hi, currency)}
            </div>
          </div>
          <div className="stat-cell">
            <div className="stat-cell-label">Periode laag</div>
            <div className="stat-cell-val">
              {isIndex ? view.lo.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : formatPrice(view.lo, currency)}
            </div>
          </div>
          <div className="stat-cell">
            <div className="stat-cell-label">52-wk hoog</div>
            <div className="stat-cell-val">
              {isIndex ? stock.w52high.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : formatPrice(stock.w52high, currency)}
            </div>
          </div>
          <div className="stat-cell">
            <div className="stat-cell-label">52-wk laag</div>
            <div className="stat-cell-val">
              {isIndex ? stock.w52low.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : formatPrice(stock.w52low, currency)}
            </div>
          </div>
        </div>

        <div className="quick-row">
          {quick.map((q) => (
            <div key={q.label} className="quick-cell">
              <div className="quick-label">{q.label}</div>
              <div className={`quick-val ${(q.v ?? 0) >= 0 ? 'pos' : 'neg'}`}>{formatPct(q.v)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
