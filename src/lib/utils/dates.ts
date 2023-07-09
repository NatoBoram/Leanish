import { Duration, durationUnit } from './duration'

export function lemmyDate(date: string) {
	return new Date(`${date}Z`)
}

export function timeAgo(date: Date) {
	const now = new Date()
	const milliseconds = now.getTime() - date.getTime()
	const duration = new Duration(milliseconds, durationUnit.millisecond)

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
