const suffixes = [
	{ min: 1_000_000_000_000_000_000_000_000n, suffix: 'Y' },
	{ min: 1_000_000_000_000_000_000_000n, suffix: 'Z' },
	{ min: 1_000_000_000_000_000_000n, suffix: 'E' },
	{ min: 1_000_000_000_000_000n, suffix: 'P' },
	{ min: 1_000_000_000_000n, suffix: 'T' },
	{ min: 1_000_000_000n, suffix: 'G' },
	{ min: 1_000_000n, suffix: 'M' },
	{ min: 1_000n, suffix: 'K' },
] as const

export function toSuffixNumber(n: number): string {
	const bn = BigInt(n)
	const suffix = suffixes.find(({ min }) => bn >= min)
	if (!suffix) return n.toString()
	return `${(n / Number(suffix.min)).toFixed(2)} ${suffix.suffix}`
}
