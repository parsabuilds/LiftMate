// Charts plot dates on a numeric time axis, so event markers can sit on any
// day (not only days with a data point) and repeated days don't collide.
export function dateToTime(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).getTime();
}

export function formatTimeTick(time: number): string {
  const d = new Date(time);
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
