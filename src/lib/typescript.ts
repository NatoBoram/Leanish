type AtLeastOne<T> = [T, ...T[]]

export function exhaustive<T extends string>() {
	return <L extends AtLeastOne<T>>(
		...x: L extends unknown
			? Exclude<T, L[number]> extends never
				? L
				: Exclude<T, L[number]>[]
			: never
	) => x
}

export function includes<T extends string>(item: string, list: T[]): item is T {
	return list.includes(item as T)
}
