import { describe, test } from 'vitest'
import { durationAgo, fullTimeAgo, timeAgo } from './dates.ts'
import { Duration, durationUnit } from './duration.ts'

describe.concurrent('timeAgo', () => {
	test('just now', ({ expect }) => {
		const now = new Date()
		expect(timeAgo(now)).toBe('just now')
	})

	test('in the future', ({ expect }) => {
		const maxDate = new Date(8_640_000_000_000_000)
		expect(timeAgo(maxDate)).toBe('in the future')
	})

	test('2 subepochs ago', ({ expect }) => {
		const minDate = new Date(-8_640_000_000_000_000)
		expect(timeAgo(minDate)).toBe('2 subepochs ago')
	})
})

describe.concurrent('durationAgo', () => {
	test('MAX_SAFE_INTEGER', ({ expect }) => {
		const duration = new Duration(Number.MAX_SAFE_INTEGER, durationUnit.millisecond)
		expect(durationAgo(duration)).toBe('2 subepochs ago')
	})

	test('1 month ago', ({ expect }) => {
		const duration = new Duration(1.1, durationUnit.month)
		expect(durationAgo(duration)).toBe('1 month ago')
	})

	test('2 months ago', ({ expect }) => {
		const duration = new Duration(2.2, durationUnit.month)
		expect(durationAgo(duration)).toBe('2 months ago')
	})
})

describe('fullTime', () => {
	test('in the future', ({ expect }) => {
		const date = new Date(8_640_000_000_000_000)
		expect(fullTimeAgo(date)).toBe('in the future')
	})

	test.skipIf(process.env['CI'])('1h 2m 3s ago', ({ expect }) => {
		const date = new Date()
		date.setHours(date.getHours() - 1)
		date.setMinutes(date.getMinutes() - 2)
		date.setSeconds(date.getSeconds() - 3)

		expect(fullTimeAgo(date)).toBe('1 hour 2 minutes 3 seconds ago')
	})
})
