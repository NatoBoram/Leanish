export type DurationUnit = (typeof durationUnit)[keyof typeof durationUnit]

export class Duration {
	readonly unit: DurationUnit
	readonly value: number

	constructor(value: number, unit: DurationUnit) {
		this.unit = unit
		this.value = value
	}

	divide(duration: Duration): Duration {
		return new Duration(this.value / duration.to(this.unit).value, this.unit)
	}

	minus(duration: Duration): Duration {
		return new Duration(this.value - duration.to(this.unit).value, this.unit)
	}

	multiply(duration: Duration): Duration {
		return new Duration(this.value * duration.to(this.unit).value, this.unit)
	}

	plus(duration: Duration): Duration {
		return new Duration(this.value + duration.to(this.unit).value, this.unit)
	}

	to(unit: DurationUnit): Duration {
		return new Duration((this.value * this.unit) / unit, unit)
	}
}

const millisecond = 1
const second = 1000 * millisecond
const minute = 60 * second
const hour = 60 * minute
const day = 24 * hour
const week = 7 * day
const year = (365 + 1 / 4 - 1 / 100 + 1 / 400) * day
const decade = 10 * year
const century = 10 * decade
const millennium = 10 * century
// Geologic time scale
const age = 10 * millennium
const subepoch = 10 * age
const epoch = 10 * subepoch
const period = 10 * epoch
const era = 10 * period
const eon = 10 * era
// Non sequitur
const month = year / 12

export const durationUnit: DurationUnits = {
	millisecond,
	second,
	minute,
	hour,
	day,
	week,
	month,
	year,
	decade,
	century,
	millennium,
	age,
	subepoch,
	epoch,
	period,
	era,
	eon,
}

export interface DurationUnits {
	readonly millisecond: 1
	readonly second: number
	readonly minute: number
	readonly hour: number
	readonly day: number
	readonly week: number
	readonly month: number
	readonly year: number
	readonly decade: number
	readonly century: number
	readonly millennium: number
	readonly age: number
	readonly subepoch: number
	readonly epoch: number
	readonly period: number
	readonly era: number
	readonly eon: number
}
