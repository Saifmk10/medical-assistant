// =============================================================
// utils/date.ts — small date formatting helpers
// -------------------------------------------------------------
export function formatFriendlyDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, tomorrow)) return 'Tomorrow';

  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}
