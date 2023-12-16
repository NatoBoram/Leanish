import { describe, test } from 'vitest'
import { PACKAGE_NAME, PACKAGE_VERSION } from './env.js'
import { headers } from './requests.js'

describe.concurrent('headers', () => {
	test('jwt + user agent', ({ expect }) => {
		const jwt = 'f8bfe7cc-d301-4151-a1da-d6f2c872370f'
		const params = { site: 'lemm.ee' }
		const referer = '/c/leanish@lemmy.world'

		const result = headers(jwt, params, referer)

		expect(result).toEqual({
			Authorization: `Bearer ${jwt}`,
			'User-Agent': `${PACKAGE_NAME}@${PACKAGE_VERSION}`,
		})
	})

	test('user agent', ({ expect }) => {
		const jwt = undefined
		const params = { site: 'lemm.ee' }
		const referer = '/c/leanish@lemmy.world'

		const result = headers(jwt, params, referer)

		expect(result).toEqual({
			'User-Agent': `${PACKAGE_NAME}@${PACKAGE_VERSION}`,
		})
	})

	test('bypass', ({ expect }) => {
		const jwt = '40d6adbe-789e-48b1-9ded-e9813aa554d7'
		const params = { site: 'lemm.ee' }
		const referer = '/c/leanish@lemmy.world'

		const result = headers(jwt, params, referer, true)

		expect(result).toEqual({
			Authorization: `Bearer ${jwt}`,
			Host: params.site,
			Origin: `https://${params.site}`,
			Referer: `https://${params.site}${referer}`,
		})
	})
})
