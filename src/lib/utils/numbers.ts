export const suffixes = [
	{ min: 1_000_000_000_000_000_000_000_000n, suffix: 'Y' },
	{ min: 1_000_000_000_000_000_000_000n, suffix: 'Z' },
	{ min: 1_000_000_000_000_000_000n, suffix: 'E' },
	{ min: 1_000_000_000_000_000, suffix: 'P' },
	{ min: 1_000_000_000_000, suffix: 'T' },
	{ min: 1_000_000_000, suffix: 'G' },
	{ min: 1_000_000, suffix: 'M' },
	{ min: 1_000, suffix: 'K' },
] as const

export function toSuffixNumber(n: bigint | number): string {
	const bn = typeof n === 'number' ? BigInt(Math.round(n)) : n
	const suffix = suffixes.find(({ min }) => bn >= min)
	if (!suffix) return n.toString()

	return `${(Number(n) / Number(suffix.min)).toFixed(2)} ${suffix.suffix}`
}
