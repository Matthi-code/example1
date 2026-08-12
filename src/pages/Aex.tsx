import { useEffect, useMemo, useState } from 'react'
import Sparkline from '../aex/Sparkline'
import DetailModal from '../aex/DetailModal'
import {
  loadDataset,
  sliceRange,
  formatPct,
  formatPrice,
  formatIndex,
  CHG_META,
} from '../aex/data'
import type { AexDataset, Stock, ChgKey } from '../aex/data'
import './Aex.css'

type SortKey = 'name' | 'price' | 'chg24' | 'chg1w' | 'chg2w'

export default function Aex() {
  const [data, setData] = useState<AexDataset | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Stock | 'index' | null>(null)
  const [moverMetric, setMoverMetric] = useState<ChgKey>('chg24')
  const [sortKey, setSortKey] = useState<SortKey>('chg24')
  const [sortDir, setSortDir] = useState<1 | -1>(-1)

  useEffect(() => {
    loadDataset().then(setData).catch((e) => setError(String(e.message ?? e)))
  }, [])

  const breadth = useMemo(() => {
    if (!data) return null
    let up = 0,
      down = 0,
      flat = 0
    for (const s of data.stocks) {
      const c = s.chg24 ?? 0
      if (c > 0) up++
      else if (c < 0) down++
      else flat++
    }
    return { up, down, flat }
  }, [data])

  const movers = useMemo(() => {
    if (!data) return { gainers: [], losers: [], maxAbs: 1 }
    const sorted = [...data.stocks].sort(
      (a, b) => (b[moverMetric] ?? 0) - (a[moverMetric] ?? 0),
    )
    const gainers = sorted.slice(0, 5)
    const losers = sorted.slice(-5).reverse()
    const maxAbs = Math.max(
      1,
      ...data.stocks.map((s) => Math.abs(s[moverMetric] ?? 0)),
    )
    return { gainers, losers, maxAbs }
  }, [data, moverMetric])

  const rows = useMemo(() => {
    if (!data) return []
    const arr = [...data.stocks]
    arr.sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name) * sortDir
      const av = a[sortKey] ?? -Infinity
      const bv = b[sortKey] ?? -Infinity
      return (av - bv) * sortDir
    })
    return arr
  }, [data, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 1 ? -1 : 1))
    else {
      setSortKey(key)
      setSortDir(key === 'name' ? 1 : -1)
    }
  }

  if (error)
    return (
      <div className="aex">
        <div className="aex-error">⚠️ {error}</div>
      </div>
    )

  if (!data || !breadth)
    return (
      <div className="aex">
        <div className="aex-loading">
          <div className="spinner" />
          <p>Marktdata laden…</p>
        </div>
      </div>
    )

  const idx = data.index
  const idxUp = (idx.chg24 ?? 0) >= 0
  const idxSpark = sliceRange(idx.daily, 91)
  const topGainer = movers.gainers[0]
  const topLoser = movers.losers[0]

  return (
    <div className="aex">
      <header className="aex-header">
        <div>
          <h1>
            AEX <span className="aex-sub">Overzicht</span>
          </h1>
          <p className="aex-tag">
            Amsterdam Exchange Index — grootste stijgers &amp; dalers, met koersverloop
          </p>
        </div>
        <div className="aex-asof">
          Momentopname · {data.asOfISO}
        </div>
      </header>

      {/* Hero index card */}
      <section
        className={`index-hero ${idxUp ? 'up' : 'down'}`}
        onClick={() => setSelected('index')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setSelected('index')}
      >
        <div className="index-hero-left">
          <div className="index-name">{idx.name}</div>
          <div className="index-value">{formatIndex(idx.price)}</div>
          <div className={`delta big ${idxUp ? 'pos' : 'neg'}`}>
            {idxUp ? '▲' : '▼'} {formatPct(idx.chg24)}
            <span className="delta-sub">vandaag</span>
          </div>
          <div className="index-mini-stats">
            <span>1 wk <b className={(idx.chg1w ?? 0) >= 0 ? 'pos' : 'neg'}>{formatPct(idx.chg1w)}</b></span>
            <span>2 wkn <b className={(idx.chg2w ?? 0) >= 0 ? 'pos' : 'neg'}>{formatPct(idx.chg2w)}</b></span>
            <span>1 jr <b className={(idx.chg1y ?? 0) >= 0 ? 'pos' : 'neg'}>{formatPct(idx.chg1y)}</b></span>
          </div>
        </div>
        <div className="index-hero-right">
          <Sparkline points={idxSpark} up={idxUp} width={340} height={110} strokeWidth={2.2} />
          <span className="index-spark-cap">Laatste 3 maanden · klik voor 5 jr verloop</span>
        </div>
      </section>

      {/* Breadth stats */}
      <section className="stat-strip">
        <div className="strip-cell">
          <div className="strip-label">Stijgers</div>
          <div className="strip-val pos">{breadth.up}</div>
        </div>
        <div className="strip-cell">
          <div className="strip-label">Dalers</div>
          <div className="strip-val neg">{breadth.down}</div>
        </div>
        <div className="strip-cell">
          <div className="strip-label">Ongewijzigd</div>
          <div className="strip-val muted">{breadth.flat}</div>
        </div>
        {topGainer && (
          <div className="strip-cell wide">
            <div className="strip-label">Grootste stijger (24u)</div>
            <div className="strip-val-row">
              <span className="strip-name">{topGainer.name}</span>
              <span className="pos">{formatPct(topGainer.chg24)}</span>
            </div>
          </div>
        )}
        {topLoser && (
          <div className="strip-cell wide">
            <div className="strip-label">Grootste daler (24u)</div>
            <div className="strip-val-row">
              <span className="strip-name">{topLoser.name}</span>
              <span className="neg">{formatPct(topLoser.chg24)}</span>
            </div>
          </div>
        )}
      </section>

      {/* Movers */}
      <section className="movers">
        <div className="movers-head">
          <h2>Stijgers &amp; dalers</h2>
          <div className="metric-toggle">
            {(Object.keys(CHG_META) as ChgKey[]).map((k) => (
              <button
                key={k}
                className={moverMetric === k ? 'active' : ''}
                onClick={() => setMoverMetric(k)}
              >
                {CHG_META[k].short}
              </button>
            ))}
          </div>
        </div>
        <div className="movers-grid">
          <MoverList
            title="Top stijgers"
            kind="up"
            stocks={movers.gainers}
            metric={moverMetric}
            maxAbs={movers.maxAbs}
            onPick={setSelected}
          />
          <MoverList
            title="Top dalers"
            kind="down"
            stocks={movers.losers}
            metric={moverMetric}
            maxAbs={movers.maxAbs}
            onPick={setSelected}
          />
        </div>
      </section>

      {/* Full table */}
      <section className="table-section">
        <h2>Alle {data.stocks.length} fondsen</h2>
        <p className="table-hint">Klik op een fonds voor het koersverloop (2 wkn · 3 mnd · 1 jr · 5 jr)</p>
        <div className="table-scroll">
          <table className="aex-table">
            <thead>
              <tr>
                <Th label="Fonds" k="name" cur={sortKey} dir={sortDir} onSort={toggleSort} align="left" />
                <th className="spark-col">2 wkn</th>
                <Th label="Koers" k="price" cur={sortKey} dir={sortDir} onSort={toggleSort} />
                <Th label="24u" k="chg24" cur={sortKey} dir={sortDir} onSort={toggleSort} />
                <Th label="1 wk" k="chg1w" cur={sortKey} dir={sortDir} onSort={toggleSort} />
                <Th label="2 wkn" k="chg2w" cur={sortKey} dir={sortDir} onSort={toggleSort} />
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => {
                const up2w = (s.chg2w ?? 0) >= 0
                return (
                  <tr key={s.sym} onClick={() => setSelected(s)} tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setSelected(s)}>
                    <td className="cell-name">
                      <span className="row-name">{s.name}</span>
                      <span className="row-sym">{s.sym.replace('.AS', '')}</span>
                    </td>
                    <td className="spark-col">
                      <Sparkline points={sliceRange(s.daily, 14)} up={up2w} width={92} height={30} fill={false} />
                    </td>
                    <td className="num">{formatPrice(s.price, s.currency)}</td>
                    <Pct v={s.chg24} />
                    <Pct v={s.chg1w} />
                    <Pct v={s.chg2w} />
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="aex-footer">
        <p>
          Bron: Yahoo Finance · dagkoersen · momentopname van <b>{data.asOfISO}</b>. Uitsluitend ter
          illustratie, geen beleggingsadvies. Percentages: 24u = t.o.v. vorige slotkoers; 1&nbsp;wk / 2&nbsp;wkn
          = t.o.v. slotkoers ~7 / ~14 kalenderdagen terug.
        </p>
      </footer>

      {selected && (
        <DetailModal
          stock={selected === 'index' ? data.index : selected}
          isIndex={selected === 'index'}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}

function Th({
  label,
  k,
  cur,
  dir,
  onSort,
  align = 'right',
}: {
  label: string
  k: SortKey
  cur: SortKey
  dir: 1 | -1
  onSort: (k: SortKey) => void
  align?: 'left' | 'right'
}) {
  const active = cur === k
  return (
    <th
      className={`sortable ${align === 'left' ? 'th-left' : ''} ${active ? 'active' : ''}`}
      onClick={() => onSort(k)}
    >
      {label}
      <span className="sort-caret">{active ? (dir === 1 ? '▲' : '▼') : ''}</span>
    </th>
  )
}

function Pct({ v }: { v: number | null }) {
  const pos = (v ?? 0) >= 0
  return <td className={`num pct ${pos ? 'pos' : 'neg'}`}>{formatPct(v)}</td>
}

function MoverList({
  title,
  kind,
  stocks,
  metric,
  maxAbs,
  onPick,
}: {
  title: string
  kind: 'up' | 'down'
  stocks: Stock[]
  metric: ChgKey
  maxAbs: number
  onPick: (s: Stock) => void
}) {
  return (
    <div className={`mover-list ${kind}`}>
      <div className="mover-title">
        <span className="mover-dot" /> {title}
      </div>
      {stocks.map((s) => {
        const v = s[metric] ?? 0
        const pos = v >= 0
        const w = Math.min(100, (Math.abs(v) / maxAbs) * 100)
        return (
          <button className="mover-row" key={s.sym} onClick={() => onPick(s)}>
            <span className="mover-name">
              {s.name}
              <span className="mover-price">{formatPrice(s.price, s.currency)}</span>
            </span>
            <span className="mover-bar-wrap">
              <span className={`mover-bar ${pos ? 'pos' : 'neg'}`} style={{ width: `${w}%` }} />
            </span>
            <span className={`mover-pct ${pos ? 'pos' : 'neg'}`}>{formatPct(v)}</span>
          </button>
        )
      })}
    </div>
  )
}
