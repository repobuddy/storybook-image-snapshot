import { it } from 'vitest'
import { existFile } from './exist_file.ts'

it('returns when `testPath` is undefined', () => {
	existFile({} as any, '')
})
