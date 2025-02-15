import type { LemmyHttp } from 'lemmy-js-client'
import { getContext, setContext } from 'svelte'

export function getClientContext(): LemmyHttp {
	return getContext<LemmyHttp>('client')
}

export function setClientContext(client: LemmyHttp): LemmyHttp {
	return setContext<LemmyHttp>('client', client)
}
