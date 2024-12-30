import { it } from 'vitest'
import { existDir } from './exist_dir.ts'

it('returns when `testPath` is undefined', () => {
	existDir({} as any, '')
})
