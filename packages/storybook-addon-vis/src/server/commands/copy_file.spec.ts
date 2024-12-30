import { it } from 'vitest'
import { copyFile } from './copy_file.ts'

it('returns when `testPath` is undefined', () => {
	copyFile({} as any, '', '')
})
