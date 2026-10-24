import { describe, test } from 'vitest'
import { params } from './params.ts'

describe.concurrent('params', () => {
	test('community', async ({ expect }) => {
		const result = await params.community['~standard'].validate('leanish@lemmy.world')
		expect(result).toEqual({ value: true })
	})

	test('invalid community', async ({ expect }) => {
		const result = await params.community['~standard'].validate('leanish')
		expect(result).toEqual({ value: false })
	})

	test('site', async ({ expect }) => {
		const result = await params.site['~standard'].validate('lemmy.world')
		expect(result).toEqual({ value: true })
	})

	test('invalid site', async ({ expect }) => {
		const result = await params.site['~standard'].validate('')
		expect(result).toEqual({ value: false })
	})
})
