import { describe, test } from 'vitest'
import { match } from './site.js'

describe.concurrent('site', () => {
	test('match', ({ expect }) => {
		const matched = match('lemm.ee')
		expect(matched).toBe(true)
	})

	test('mismatch', ({ expect }) => {
		const matched = match('')
		expect(matched).toBe(false)
	})
})
