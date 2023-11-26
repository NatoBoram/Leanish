import { describe, test } from 'vitest'
import { fullTimeAgo, timeAgo } from './dates.js'

describe('timeAgo', () => {
	test('just now', ({ expect }) => expect(timeAgo(new Date())).toBe('just now'))

	test('in the future', ({ expect }) => {
		const date = new Date(8640000000000000)
		expect(timeAgo(date)).toBe('in the future')
	})

	test('2 subepochs ago', ({ expect }) => {
		const date = new Date(-8640000000000000)
		expect(timeAgo(date)).toBe('2 subepochs ago')
	})
})

describe('fullTime', () => {
	test('min date', ({ expect }) => {
		const date = new Date(-8640000000000000)
		expect(fullTimeAgo(date)).toBeTypeOf('string')
	})

	test('in the future', ({ expect }) => {
		const date = new Date(8640000000000000)
		expect(fullTimeAgo(date)).toBe('in the future')
	})

	test('1h 2m 3s ago', ({ expect }) => {
		const date = new Date()
		date.setHours(date.getHours() - 1)
		date.setMinutes(date.getMinutes() - 2)
		date.setSeconds(date.getSeconds() - 3)

		expect(fullTimeAgo(date)).toBe('1 hour 2 minutes 3 seconds ago')
	})
})
