import { expect, it } from 'vitest'
import { toImageData } from './image_data.ts'

it('throws when input it not an image', async () => {
	await expect(() => toImageData('')).rejects.toThrow('Failed to load image')
})
