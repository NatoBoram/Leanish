import { version } from '$app/env'
import { assets, immutable, prerendered } from '$app/manifest'
import { resolve } from '$app/paths'
import { self } from '$app/service-worker'

const cacheKey = `cache-${version}`

const ASSETS: string[] = [
	...immutable.map(({ path }) => resolve(path)),
	...assets.map(({ path }) => resolve(path)),
	...prerendered.map(({ path }) => resolve(path)),
]

self.addEventListener('install', event => {
	async function addFilesToCache() {
		const cache = await caches.open(cacheKey)
		await cache.addAll(ASSETS)
	}

	event.waitUntil(addFilesToCache())
})

self.addEventListener('activate', event => {
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== cacheKey) await caches.delete(key)
		}
	}

	event.waitUntil(deleteOldCaches())
})

self.addEventListener('fetch', event => {
	if (event.request.method !== 'GET') return

	void respond(event).then(response => {
		if (response) event.respondWith(response)
	})
})

async function respond(event: FetchEvent) {
	const url = new URL(event.request.url)
	const cache = await caches.open(cacheKey)

	if (ASSETS.includes(url.pathname)) {
		return cache.match(url.pathname)
	}

	try {
		const response = await fetch(event.request)
		if (response.status === 200) {
			await cache.put(event.request, response.clone())
		}

		return response
	} catch {
		return cache.match(event.request)
	}
}
