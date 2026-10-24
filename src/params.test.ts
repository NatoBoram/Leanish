import { describe, test } from 'vitest'
import { params } from './params.ts'

describe.concurrent('params', () => {
	test('community', async ({ expect }) => {
		const result = await params.community['~standard'].validate('leanish@lemmy.world')
		expect(result).toEqual({ value: 'leanish@lemmy.world' })
	})

	test('invalid community', async ({ expect }) => {
		const result = await params.community['~standard'].validate('leanish')
		expect(result.issues).toBeDefined()
	})

	test('site', async ({ expect }) => {
		const result = await params.site['~standard'].validate('lemmy.world')
		expect(result).toEqual({ value: 'lemmy.world' })
	})

	test('invalid site', async ({ expect }) => {
		const result = await params.site['~standard'].validate('')
		expect(result.issues).toBeDefined()
	})
})
