// Types and helpers for the AEX market dashboard.
// The dataset is a static snapshot fetched from /data/aex.json (see public/data).
// Prices are daily closes from Yahoo Finance, stored compactly as [epochDay, close].

export type DailyPoint = [number, number] // [days since epoch, close]

export interface Stock {
  sym: string
  name: string
  sector: string
  price: number
  currency: string
  prevClose: number
  w52high: number
  w52low: number
  marketTime: number
  daily: DailyPoint[]
  chg24: number | null
  chg1w: number | null
  chg2w: number | null
  chg3m: number | null
  chg1y: number | null
  chg5y: number | null
}

export interface IndexData extends Omit<Stock, 'sector' | 'currency'> {
  currency?: string
}

export interface AexDataset {
  asOf: number
  asOfISO: string
  index: IndexData
  stocks: Stock[]
}

export type RangeKey = '2w' | '3m' | '1y' | '5y'

export interface RangeDef {
  key: RangeKey
  label: string
  days: number | null // null = full history
}

export const RANGES: RangeDef[] = [
  { key: '2w', label: '2 wkn', days: 14 },
  { key: '3m', label: '3 mnd', days: 91 },
  { key: '1y', label: '1 jr', days: 365 },
  { key: '5y', label: '5 jr', days: null },
]

export type ChgKey = 'chg24' | 'chg1w' | 'chg2w'

export const CHG_META: Record<ChgKey, { label: string; short: string }> = {
  chg24: { label: '24 uur', short: '24u' },
  chg1w: { label: '1 week', short: '1wk' },
  chg2w: { label: '2 weken', short: '2wk' },
}

const DAY_MS = 86400 * 1000

export function dayToDate(epochDay: number): Date {
  return new Date(epochDay * DAY_MS)
}

/** Slice a daily series to the given range (from the last available day). */
export function sliceRange(daily: DailyPoint[], days: number | null): DailyPoint[] {
  if (days == null || daily.length === 0) return daily
  const lastDay = daily[daily.length - 1][0]
  const cutoff = lastDay - days
  // find first index with day >= cutoff (keep one earlier anchor if possible)
  let i = daily.length - 1
  while (i > 0 && daily[i - 1][0] >= cutoff) i--
  return daily.slice(i)
}

export function formatPct(v: number | null): string {
  if (v == null || Number.isNaN(v)) return '–'
  const s = v >= 0 ? '+' : ''
  return `${s}${v.toFixed(2)}%`
}

export function formatPrice(v: number, currency = 'EUR'): string {
  const symbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : ''
  const digits = v >= 100 ? 2 : v >= 10 ? 2 : v >= 1 ? 2 : 3
  return `${symbol} ${v.toLocaleString('nl-NL', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`
}

export function formatIndex(v: number): string {
  return v.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function formatDate(d: Date, withYear = true): string {
  return d.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    ...(withYear ? { year: 'numeric' } : {}),
  })
}

export async function loadDataset(): Promise<AexDataset> {
  const base = import.meta.env.BASE_URL ?? '/'
  const res = await fetch(`${base}data/aex.json`)
  if (!res.ok) throw new Error(`Kon marktdata niet laden (${res.status})`)
  return (await res.json()) as AexDataset
}
