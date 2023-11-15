import { describe, test } from 'vitest'
import { fullTimeAgo, timeAgo } from './dates'

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
	test('max date', ({ expect }) => {
		const date = new Date(-8640000000000000)
		expect(fullTimeAgo(date)).toBeTypeOf('string')
	})
})
