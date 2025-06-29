export type Timeframe = {
  id?: string;       // optional karena defaultTimeframes mungkin belum punya ID
  code: string;
  userId?: string | null;
};

/**
 * Konversi kode timeframe ke menit
 */
export function timeframeToMinutes(code: string): number {
  const match = code.match(/^(\d+)([mHdWM])$/);
  if (!match) return Infinity;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "m": return value;
    case "H": return value * 60;
    case "D": return value * 60 * 24;
    case "W": return value * 60 * 24 * 7;
    case "M": return value * 60 * 24 * 30;
    default: return Infinity;
  }
}

/**
 * Sort timeframes dari yang terkecil ke terbesar berdasarkan menit
 */
export function sortTimeframes<T extends Pick<Timeframe, "code">>(timeframes: T[]): T[] {
  return [...timeframes].sort((a, b) => timeframeToMinutes(a.code) - timeframeToMinutes(b.code));
}

/**
 * Default global timeframes
 */
export const defaultTimeframes: Timeframe[] = [
  { code: "1d" },
  { code: "1h" },
  { code: "45m" },
  { code: "15m" },
  { code: "1m" },
];

/**
 * Default timeframes yang sudah tersortir
 */
export const sortedDefaultTimeframes = sortTimeframes(defaultTimeframes);
