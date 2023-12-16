import { describe, test, vitest } from 'vitest'
import { PACKAGE_NAME, PACKAGE_VERSION } from './env.js'
import { addAuthBody, addAuthParam, headers, serverFetch } from './requests.js'

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

describe.concurrent('serverFetch', () => {
	test('adds auth to param and body when jwt is provided', async ({ expect }) => {
		const jwt = '7149c5c8-bf40-48ff-920e-317149873607'
		const mockedFetch = vitest.fn().mockResolvedValue({ ok: true })
		const wrappedFetch = serverFetch(mockedFetch, jwt)

		const input = new URL('https://lemm.ee/api/v3/site')
		const init = { method: 'GET' }

		await wrappedFetch(input, init)

		expect(mockedFetch).toHaveBeenCalledWith(addAuthParam(input, jwt), addAuthBody(init, jwt))
	})

	test('does not add auth param and body when jwt is not provided', async ({ expect }) => {
		const jwt = undefined
		const mockedFetch = vitest.fn().mockResolvedValue({ ok: true })
		const wrappedFetch = serverFetch(mockedFetch, jwt)

		const input = new URL('https://lemm.ee/api/v3/site')
		const init = { method: 'GET' }

		await wrappedFetch(input, init)

		expect(mockedFetch).toHaveBeenCalledWith(input, init)
	})

	test('throws error when response is not ok', async ({ expect }) => {
		const jwt = '86b8a525-7af5-43c9-b1c5-e09d734e701e'
		const res = {
			clone: () => res,
			headers: new Headers(),
			ok: false,
			status: 500,
			statusText: 'Internal Server Error',
			text: () => Promise.resolve('Internal Server Error'),
		} satisfies TestResponse as Response
		const mockedFetch = vitest.fn().mockResolvedValue(res)
		const wrappedFetch = serverFetch(mockedFetch, jwt)

		const input = new URL('https://lemm.ee/api/v3/site')
		const init = { method: 'GET' }

		const wrappedResponse = wrappedFetch(input, init)

		expect(mockedFetch).toHaveBeenCalledWith(addAuthParam(input, jwt), addAuthBody(init, jwt))
		await expect(wrappedResponse).rejects.toMatchObject(res)
	})
})

type TestResponse = Pick<Response, 'clone' | 'headers' | 'ok' | 'status' | 'statusText' | 'text'>
