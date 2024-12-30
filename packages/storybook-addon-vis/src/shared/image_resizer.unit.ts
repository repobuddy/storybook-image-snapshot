import { expect, it } from 'vitest'
import { UNI_IMAGE_DATA } from '../testing/constants.ts'
import { createImageResizer, createImageResizer2 } from './image_resizer.ts'

it('returns the same image if no resize is needed', async () => {
	const image = UNI_IMAGE_DATA
	let result = await createImageResizer(image)(image)
	expect(result).toBe(image)
	result = await createImageResizer2(image)(image)
	expect(result).toBe(image)
})

it('takes less than 200ms to resize 16 times', async () => {
	await testResize(createImageResizer, UNI_IMAGE_DATA, 4, 1)
})

it('takes less than 200ms to resize 16 times (createImageResizer2)', async () => {
	await testResize(createImageResizer2, UNI_IMAGE_DATA, 4, 1)
})

async function testResize(fn: typeof createImageResizer, image: ImageData, factor: number, length: number) {
	const startTime = new Date().getTime()
	const resize = fn({ width: image.width * factor, height: image.height * factor })
	await Promise.all(Array.from({ length }).map(async () => resize(image)))
	const endTime = new Date().getTime()
	const executionTime = endTime - startTime
	expect(executionTime / length).toBeLessThan(200)
}
