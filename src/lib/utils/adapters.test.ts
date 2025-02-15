import { describe, test } from 'vitest'
import { isLessThan, isNumericRange, toLessThan, toNumericRange } from './adapters.ts'

describe.concurrent('isLessThan', () => {
	test('returns `true` if input is less than max', ({ expect }) => {
		const result = isLessThan(1, 2)
		expect(result).toBe(true)
	})

	test('returns `false` if input is equal to max', ({ expect }) => {
		const result = isLessThan(2, 2)
		expect(result).toBe(false)
	})

	test('returns `false` if input is greater than max', ({ expect }) => {
		const result = isLessThan(2, 1)
		expect(result).toBe(false)
	})
})

describe.concurrent('toLessThan', () => {
	test('returns input if input is less than max', ({ expect }) => {
		const result = toLessThan(1, 2)
		expect(result).toBe(1)
	})

	test('returns max - 1 if input is equal to max', ({ expect }) => {
		const result = toLessThan(2, 2)
		expect(result).toBe(1)
	})

	test('returns max - 1 if input is greater than max', ({ expect }) => {
		const result = toLessThan(2, 1)
		expect(result).toBe(0)
	})
})

describe.concurrent('isNumericRange', () => {
	test('returns `true` if input is within range', ({ expect }) => {
		const result = isNumericRange(2, 1, 3)
		expect(result).toBe(true)
	})

	test('returns `false` if input is less than min', ({ expect }) => {
		const result = isNumericRange(0, 1, 3)
		expect(result).toBe(false)
	})

	test('returns `false` if input is greater than max', ({ expect }) => {
		const result = isNumericRange(4, 1, 3)
		expect(result).toBe(false)
	})

	test('returns `true` if input is equal to min and max', ({ expect }) => {
		const result = isNumericRange(1, 1, 1)
		expect(result).toBe(true)
	})
})

describe.concurrent('toNumericRange', () => {
	test('returns min if input is less than min', ({ expect }) => {
		const result = toNumericRange(0, 1, 3)
		expect(result).toBe(1)
	})

	test('returns input if input is within range', ({ expect }) => {
		const result = toNumericRange(2, 1, 3)
		expect(result).toBe(2)
	})

	test('returns max if input is greater than max', ({ expect }) => {
		const result = toNumericRange(4, 1, 3)
		expect(result).toBe(3)
	})

	test('returns input if input is equal to min and max', ({ expect }) => {
		const result = toNumericRange(1, 1, 1)
		expect(result).toBe(1)
	})
})
