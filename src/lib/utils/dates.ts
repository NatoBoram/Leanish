import { Duration, durationUnit } from './duration.js'

/**
 * @param duration the positive duration to convert to a human-readable string. Negative durations
 * are treated being in the future.
 *
 * @returns a human-readable string representation of how much time ago was this duration.
 * @example "2 hours ago"
 */
export function durationAgo(duration: Duration) {
	duration = duration.to(durationUnit.millisecond)
	if (duration.value < 0) return 'in the future'

	if (duration.value < durationUnit.second) return 'just now'

	if (duration.value < durationUnit.minute) {
		const seconds = Math.floor(duration.to(durationUnit.second).value)
		return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`
	}

	if (duration.value < durationUnit.hour) {
		const minutes = Math.floor(duration.to(durationUnit.minute).value)
		return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
	}

	if (duration.value < durationUnit.day) {
		const hours = Math.floor(duration.to(durationUnit.hour).value)
		return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
	}

	if (duration.value < durationUnit.week) {
		const days = Math.floor(duration.to(durationUnit.day).value)
		return `${days} ${days === 1 ? 'day' : 'days'} ago`
	}

	if (duration.value < durationUnit.month) {
		const weeks = Math.floor(duration.to(durationUnit.week).value)
		return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
	}

	if (duration.value < durationUnit.year) {
		const months = Math.floor(duration.to(durationUnit.month).value)
		return `${months} ${months === 1 ? 'month' : 'months'} ago`
	}

	if (duration.value < durationUnit.decade) {
		const years = Math.floor(duration.to(durationUnit.year).value)
		return `${years} ${years === 1 ? 'year' : 'years'} ago`
	}

	if (duration.value < durationUnit.century) {
		const decades = Math.floor(duration.to(durationUnit.decade).value)
		return `${decades} ${decades === 1 ? 'decade' : 'decades'} ago`
	}

	if (duration.value < durationUnit.millennium) {
		const centuries = Math.floor(duration.to(durationUnit.century).value)
		return `${centuries} ${centuries === 1 ? 'century' : 'centuries'} ago`
	}

	if (duration.value < durationUnit.age) {
		const millennia = Math.floor(duration.to(durationUnit.millennium).value)
		return `${millennia} ${millennia === 1 ? 'millennium' : 'millennia'} ago`
	}

	if (duration.value < durationUnit.subepoch) {
		const ages = Math.floor(duration.to(durationUnit.age).value)
		return `${ages} ${ages === 1 ? 'age' : 'ages'} ago`
	}

	if (duration.value < durationUnit.epoch) {
		const subepochs = Math.floor(duration.to(durationUnit.subepoch).value)
		return `${subepochs} ${subepochs === 1 ? 'subepoch' : 'subepochs'} ago`
	}

	if (duration.value < durationUnit.period) {
		const epochs = Math.floor(duration.to(durationUnit.epoch).value)
		return `${epochs} ${epochs === 1 ? 'epoch' : 'epochs'} ago`
	}

	if (duration.value < durationUnit.era) {
		const periods = Math.floor(duration.to(durationUnit.period).value)
		return `${periods} ${periods === 1 ? 'period' : 'periods'} ago`
	}

	if (duration.value < durationUnit.eon) {
		const eras = Math.floor(duration.to(durationUnit.era).value)
		return `${eras} ${eras === 1 ? 'era' : 'eras'} ago`
	}

	const eons = Math.floor(duration.to(durationUnit.eon).value)
	return `${eons} ${eons === 1 ? 'eon' : 'eons'} ago`
}

export function fullTimeAgo(date: Date) {
	const now = new Date()
	const milliseconds = now.getTime() - date.getTime()

	if (milliseconds < 0) return 'in the future'

	let duration = new Duration(milliseconds, durationUnit.millisecond)
	const result = []

	const eons = duration.to(durationUnit.eon).value
	if (eons >= 1) {
		const floor = Math.floor(eons)
		result.push(`${floor} ${floor === 1 ? 'eon' : 'eons'}`)
		duration = duration.minus(new Duration(floor, durationUnit.eon))
	}

	const eras = duration.to(durationUnit.era).value
	if (eras >= 1) {
		const floor = Math.floor(eras)
		result.push(`${floor} ${floor === 1 ? 'era' : 'eras'}`)
		duration = duration.minus(new Duration(floor, durationUnit.era))
	}

	const periods = duration.to(durationUnit.period).value
	if (periods >= 1) {
		const floor = Math.floor(periods)
		result.push(`${floor} ${floor === 1 ? 'period' : 'periods'}`)
		duration = duration.minus(new Duration(floor, durationUnit.period))
	}

	const epochs = duration.to(durationUnit.epoch).value
	if (epochs >= 1) {
		const floor = Math.floor(epochs)
		result.push(`${floor} ${floor === 1 ? 'epoch' : 'epochs'}`)
		duration = duration.minus(new Duration(floor, durationUnit.epoch))
	}

	const subepochs = duration.to(durationUnit.subepoch).value
	if (subepochs >= 1) {
		const floor = Math.floor(subepochs)
		result.push(`${floor} ${floor === 1 ? 'subepoch' : 'subepochs'}`)
		duration = duration.minus(new Duration(floor, durationUnit.subepoch))
	}

	const ages = duration.to(durationUnit.age).value
	if (ages >= 1) {
		const floor = Math.floor(ages)
		result.push(`${floor} ${floor === 1 ? 'age' : 'ages'}`)
		duration = duration.minus(new Duration(floor, durationUnit.age))
	}

	const millennia = duration.to(durationUnit.millennium).value
	if (millennia >= 1) {
		const floor = Math.floor(millennia)
		result.push(`${floor} ${floor === 1 ? 'millennium' : 'millennia'}`)
		duration = duration.minus(new Duration(floor, durationUnit.millennium))
	}

	const centuries = duration.to(durationUnit.century).value
	if (centuries >= 1) {
		const floor = Math.floor(centuries)
		result.push(`${floor} ${floor === 1 ? 'century' : 'centuries'}`)
		duration = duration.minus(new Duration(floor, durationUnit.century))
	}

	const decades = duration.to(durationUnit.decade).value
	if (decades >= 1) {
		const floor = Math.floor(decades)
		result.push(`${floor} ${floor === 1 ? 'decade' : 'decades'}`)
		duration = duration.minus(new Duration(floor, durationUnit.decade))
	}

	const years = duration.to(durationUnit.year).value
	if (years >= 1) {
		const floor = Math.floor(years)
		result.push(`${floor} ${floor === 1 ? 'year' : 'years'}`)
		duration = duration.minus(new Duration(floor, durationUnit.year))
	}

	const months = duration.to(durationUnit.month).value
	if (months >= 1) {
		const floor = Math.floor(months)
		result.push(`${floor} ${floor === 1 ? 'month' : 'months'}`)
		duration = duration.minus(new Duration(floor, durationUnit.month))
	}

	const weeks = duration.to(durationUnit.week).value
	if (weeks >= 1) {
		const floor = Math.floor(weeks)
		result.push(`${floor} ${floor === 1 ? 'week' : 'weeks'}`)
		duration = duration.minus(new Duration(floor, durationUnit.week))
	}

	const days = duration.to(durationUnit.day).value
	if (days >= 1) {
		const floor = Math.floor(days)
		result.push(`${floor} ${floor === 1 ? 'day' : 'days'}`)
		duration = duration.minus(new Duration(floor, durationUnit.day))
	}

	const hours = duration.to(durationUnit.hour).value
	if (hours >= 1) {
		const floor = Math.floor(hours)
		result.push(`${floor} ${floor === 1 ? 'hour' : 'hours'}`)
		duration = duration.minus(new Duration(floor, durationUnit.hour))
	}

	const minutes = duration.to(durationUnit.minute).value
	if (minutes >= 1) {
		const floor = Math.floor(minutes)
		result.push(`${floor} ${floor === 1 ? 'minute' : 'minutes'}`)
		duration = duration.minus(new Duration(floor, durationUnit.minute))
	}

	const seconds = duration.to(durationUnit.second).value
	if (seconds >= 1) {
		const floor = Math.floor(seconds)
		result.push(`${floor} ${floor === 1 ? 'second' : 'seconds'}`)
		duration = duration.minus(new Duration(floor, durationUnit.second))
	}

	const rest = duration.to(durationUnit.millisecond).value
	if (rest >= 1) {
		const floor = Math.floor(rest)
		result.push(`${floor} ${floor === 1 ? 'millisecond' : 'milliseconds'}`)
		duration = duration.minus(new Duration(floor, durationUnit.millisecond))
	}

	result.push('ago')
	return result.join(' ')
}

export function lemmyDate(date: string) {
	if (date.endsWith('Z')) return new Date(date)
	return new Date(`${date}Z`)
}

export function timeAgo(date: Date) {
	const now = new Date()
	const milliseconds = now.getTime() - date.getTime()
	const duration = new Duration(milliseconds, durationUnit.millisecond)
	return durationAgo(duration)
}
