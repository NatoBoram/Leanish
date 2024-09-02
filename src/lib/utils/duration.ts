export type DurationUnit = (typeof durationUnit)[keyof typeof durationUnit]

export class Duration {
	constructor(
		readonly value: number,
		readonly unit: DurationUnit,
	) {}

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
export const durationUnit = {
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
} as const
