/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { LessThan, NumericRange } from '@sveltejs/kit'

// @ts-expect-error Type instantiation is excessively deep and possibly infinite.
export function isLessThan<Max extends number>(input: number, max: Max): input is LessThan<Max> {
	return input < max
}

export function isNumericRange<Min extends number, Max extends number>(
	input: number,
	min: Min,
	max: Max,
): input is NumericRange<Min, Max> {
	return min <= input && input <= max
}

export function toLessThan<Max extends number>(input: number, max: Max): LessThan<Max> {
	// @ts-expect-error Type instantiation is excessively deep and possibly infinite.
	if (isLessThan(input, max)) return input
	return (max - 1) as LessThan<Max>
}

export function toNumericRange<Min extends number, Max extends number>(
	input: number,
	min: Min,
	max: Max,
): NumericRange<Min, Max> {
	if (isLessThan(input, min)) return min as NumericRange<Min, Max>
	if (isLessThan(input, max)) return input
	return max as NumericRange<Min, Max>
}
