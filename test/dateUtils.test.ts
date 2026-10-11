import { test, expect } from 'bun:test'
import { toLocalDateString } from '../src/dateUtils.ts'

test('pads single-digit month and day', () => {
  expect(toLocalDateString(new Date(2026, 0, 5, 12, 0, 0))).toBe('2026-01-05')
})

test('end of local day stays on the same local day', () => {
  expect(toLocalDateString(new Date(2026, 11, 31, 23, 59, 59))).toBe('2026-12-31')
})

// Runs under TZ=Europe/Istanbul (see the "test" script): local midnight is the
// previous day in UTC, which is exactly what the old toISOString() code returned.
test('uses the local day at local midnight, not the UTC day (regression)', () => {
  const localMidnight = new Date(2026, 5, 15, 0, 0, 0)
  expect(toLocalDateString(localMidnight)).toBe('2026-06-15')
  expect(localMidnight.toISOString().split('T')[0]).toBe('2026-06-14')
})
