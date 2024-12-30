import * as fs from 'node:fs/promises'
import { describe, expect, it, vi } from 'vitest'
import { file } from './file.ts'

vi.mock('node:fs/promises', () => ({
	readFile: vi.fn(),
}))

describe(`${file.tryReadFileBase64.name}()`, () => {
	it('returns base64 encoded content when file exists', async () => {
		const mockContent = 'test content'
		const mockBase64 = Buffer.from(mockContent).toString('base64')
		vi.mocked(fs.readFile).mockResolvedValue(mockBase64)

		const result = await file.tryReadFileBase64('existing-file.txt')
		expect(result).toBe(mockBase64)
		expect(fs.readFile).toHaveBeenCalledWith('existing-file.txt', { encoding: 'base64' })
	})

	it('returns undefined when file does not exist', async () => {
		vi.mocked(fs.readFile).mockRejectedValue(new Error('File not found'))

		const result = await file.tryReadFileBase64('non-existent-file.txt')
		expect(result).toBeUndefined()
		expect(fs.readFile).toHaveBeenCalledWith('non-existent-file.txt', { encoding: 'base64' })
	})

	it('returns undefined for any file system error', async () => {
		vi.mocked(fs.readFile).mockRejectedValue(new Error('Permission denied'))

		const result = await file.tryReadFileBase64('inaccessible-file.txt')
		expect(result).toBeUndefined()
		expect(fs.readFile).toHaveBeenCalledWith('inaccessible-file.txt', { encoding: 'base64' })
	})

	it('handles empty files correctly', async () => {
		vi.mocked(fs.readFile).mockResolvedValue('')

		const result = await file.tryReadFileBase64('empty-file.txt')
		expect(result).toBe('')
		expect(fs.readFile).toHaveBeenCalledWith('empty-file.txt', { encoding: 'base64' })
	})
})
