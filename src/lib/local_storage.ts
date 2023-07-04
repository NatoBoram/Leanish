import type { GetSiteResponse } from 'lemmy-js-client'

type LocalStorageKey = 'sites'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class LocalStorage {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private constructor() {}

	static get sites(): GetSiteResponse[] {
		return this.getItem<GetSiteResponse[]>('sites', [])
	}

	static set sites(sites: GetSiteResponse[]) {
		this.setItem<GetSiteResponse[]>('sites', sites)
	}

	private static getItem<T>(key: LocalStorageKey, fallback: T): T {
		return (JSON.parse(localStorage.getItem(key) ?? JSON.stringify(fallback)) ?? fallback) as T
	}

	private static setItem<T>(key: LocalStorageKey, value: T): void {
		localStorage.setItem(key, JSON.stringify(value))
	}
}
