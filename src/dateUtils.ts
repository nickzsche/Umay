// Use the Date's LOCAL components, not toISOString(): the latter converts to
// UTC and reports the previous day for local midnight in UTC+ timezones.
export function toLocalDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
