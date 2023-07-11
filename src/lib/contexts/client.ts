import type { LemmyHttp } from 'lemmy-js-client'
import { getContext, setContext } from 'svelte'

export function setClientContext(client: LemmyHttp) {
	return setContext<LemmyHttp>('client', client)
}

export function getClientContext() {
	return getContext<LemmyHttp>('client')
}
