import { expect, it } from 'vitest'
import { getMaxSize } from './get_max_size.ts'

it('returns the largest width and height', () => {
	expect(getMaxSize({ width: 1, height: 3 }, { width: 4, height: 2 })).toEqual({
		width: 4,
		height: 3,
	})
})
