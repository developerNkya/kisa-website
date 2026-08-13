const SW_MONTHS = [
'Jan',
'Feb',
'Mac',
'Apr',
'Mei',
'Jun',
'Jul',
'Ago',
'Sep',
'Okt',
'Nov',
'Des'];


export function swahiliDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${SW_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function tzs(amount: number): string {
  return `TZS ${amount.toLocaleString('en-US')}`;
}

export function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

export function totalMinutes(minutes: number[]): number {
  return minutes.reduce((a, b) => a + b, 0);
}

export function readingLabel(minutes: number): string {
  if (minutes < 60) return `Dakika ${minutes}`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `Saa ${h} dk ${m}` : `Saa ${h}`;
}