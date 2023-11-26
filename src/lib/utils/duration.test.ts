import { test } from 'vitest'
import { Duration, durationUnit } from './duration.js'

test('MAX_SAFE_INTEGER', ({ expect }) => {
	const duration = new Duration(Number.MAX_SAFE_INTEGER, durationUnit.millisecond)
	const subepochs = duration.to(durationUnit.subepoch).value
	expect(subepochs).toBe(2.8542678186223407)
})
