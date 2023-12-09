import { describe, test } from 'vitest'
import { match } from './community'

describe.concurrent('community', () => {
	test('match', ({ expect }) => {
		const matched = match('leanish@lemmy.world')
		expect(matched).toBe(true)
	})

	test('mismatch', ({ expect }) => {
		const matched = match('')
		expect(matched).toBe(false)
	})
})
