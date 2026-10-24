export function isLessThan(input: number, max: number): boolean {
	return input < max
}

export function isNumericRange(input: number, min: number, max: number): boolean {
	return min <= input && input <= max
}

export function toLessThan(input: number, max: number): number {
	if (isLessThan(input, max)) return input

	return max - 1
}

export function toNumericRange(input: number, min: number, max: number): number {
	if (isLessThan(input, min)) return min

	if (isLessThan(input, max)) return input

	return max
}
