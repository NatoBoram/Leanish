/// <reference lib="esnext" />
/// <reference lib="webworker" />
/// <reference no-default-lib="true"/>
/// <reference types="@sveltejs/kit" />
import { build, files, prerendered, version } from '$service-worker'

const sw = self as unknown as ServiceWorkerGlobalScope

// Create a unique cache name for this deployment
const cacheKey = `cache-${version}`

const ASSETS = [
	...build, // the app itself
	...files, // everything in `static`
	...prerendered, // prerendered pages
]

sw.addEventListener('install', event => {
	// Create a new cache and add all files to it
	async function addFilesToCache() {
		const cache = await caches.open(cacheKey)
		await cache.addAll(ASSETS)
	}

	event.waitUntil(addFilesToCache())
})

sw.addEventListener('activate', event => {
	// Remove previous cached data from disk
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== cacheKey) await caches.delete(key)
		}
	}

	event.waitUntil(deleteOldCaches())
})

sw.addEventListener('fetch', event => {
	// ignore POST requests etc
	if (event.request.method !== 'GET') return

	void respond(event).then(response => {
		if (response) event.respondWith(response)
	})
})

async function respond(event: FetchEvent) {
	const url = new URL(event.request.url)
	const cache = await caches.open(cacheKey)

	// `build`/`files` can always be served from the cache
	if (ASSETS.includes(url.pathname)) {
		return cache.match(url.pathname)
	}

	// for everything else, try the network first, but
	// fall back to the cache if we're offline
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
