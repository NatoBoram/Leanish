import { describe, test } from 'vitest'
import { toSuffixNumber } from './numbers.ts'

describe.concurrent('toSuffixNumber', () => {
	test('large numbers', ({ expect }) => {
		expect(toSuffixNumber(9324.86)).toBe('9.32 K')
		expect(toSuffixNumber(6814206.88)).toBe('6.81 M')
		expect(toSuffixNumber(1542888068.03)).toBe('1.54 G')
		expect(toSuffixNumber(9738929036801.75)).toBe('9.74 T')
		expect(toSuffixNumber(8653033156907251)).toBe('8.65 P')
		expect(toSuffixNumber(1102757022459672834n)).toBe('1.10 E')
		expect(toSuffixNumber(1261340892622701723662n)).toBe('1.26 Z')
		expect(toSuffixNumber(6028979248962363153670258n)).toBe('6.03 Y')
	})

	test('small numbers', ({ expect }) => {
		expect(toSuffixNumber(999)).toBe('999')
	})
})
