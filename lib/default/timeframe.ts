// lib/default/timeframe.ts

export type Timeframe = {
  id?: string; // optional karena defaultTimeframes mungkin belum punya ID
  name: string;
  group: TimeFrameGroup;
  userId?: string | null;
};

export type TimeFrameGroup = "second" | "minute" | "hour" | "dayweekmonth";

/**
 * Konversi nama timeframe ke menit
 * Contoh nama yang valid: "1m", "1H", "1d", dsb
 */
export function timeframeToMinutes(name: string): number {
  const match = name.match(/^(\d+)([smHdWM])$/); // support "s" (second) juga
  if (!match) return Infinity;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "s": return value / 60;           // detik ke menit
    case "m": return value;
    case "H": return value * 60;
    case "d": return value * 60 * 24;
    case "W": return value * 60 * 24 * 7;
    case "M": return value * 60 * 24 * 30;
    default: return Infinity;
  }
}

/**
 * Sort timeframes dari yang terkecil ke terbesar berdasarkan menit
 */
export function sortTimeframes<T extends Pick<Timeframe, "name">>(timeframes: T[]): T[] {
  return [...timeframes].sort((a, b) => timeframeToMinutes(a.name) - timeframeToMinutes(b.name));
}

/**
 * Default global timeframes dengan group yang sesuai
 */
export const defaultTimeframes: Timeframe[] = [
  { name: "1s", group: "second" },
  { name: "5s", group: "second" },
  { name: "15s", group: "second" },
  { name: "30s", group: "second" },
  { name: "45s", group: "second" },
  { name: "1m", group: "minute" },
  { name: "2m", group: "minute" },
  { name: "3m", group: "minute" },
  { name: "5m", group: "minute" },
  { name: "10m", group: "minute" },
  { name: "15m", group: "minute" },
  { name: "30m", group: "minute" },
  { name: "45m", group: "minute" },
  { name: "1h", group: "hour" },
  { name: "2h", group: "hour" },
  { name: "3h", group: "hour" },
  { name: "4h", group: "hour" },
  { name: "1D", group: "dayweekmonth" },
  { name: "1W", group: "dayweekmonth" },
  { name: "1M", group: "dayweekmonth" },
  { name: "3M", group: "dayweekmonth" },
  { name: "6M", group: "dayweekmonth" },
  { name: "12M", group: "dayweekmonth" },
];

/**
 * Default timeframes yang sudah tersortir
 */
export const sortedDefaultTimeframes = sortTimeframes(defaultTimeframes);
