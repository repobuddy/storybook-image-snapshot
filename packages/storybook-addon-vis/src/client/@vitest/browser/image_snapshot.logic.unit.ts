import { describe, expect, it } from 'vitest'
import { imageSnapshotSymbol } from './constants.ts'
import { assertImageSnapshot } from './image_snapshot.logic.ts'

describe(`${assertImageSnapshot.name}`, () => {
	it('should not throw an error if subject is a valid ImageSnapshot', () => {
		const validImageSnapshot = {
			type: imageSnapshotSymbol,
			// other properties of ImageSnapshot
		}

		expect(() => assertImageSnapshot(validImageSnapshot)).not.toThrow()
	})

	it('should throw an error if subject is not a valid ImageSnapshot', () => {
		const invalidImageSnapshot = {
			type: 'invalidSymbol',
			// other properties
		}

		expect(() => assertImageSnapshot(invalidImageSnapshot)).toThrow('Expected subject to be an image snapshot')
	})

	it('should throw an error if subject is null or undefined', () => {
		expect(() => assertImageSnapshot(null)).toThrow('Expected subject to be an image snapshot')
		expect(() => assertImageSnapshot(undefined)).toThrow('Expected subject to be an image snapshot')
	})
})
