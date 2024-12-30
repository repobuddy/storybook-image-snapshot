export function getMaxSize(image1: { width: number; height: number }, image2: { width: number; height: number }) {
	const width = Math.max(image1.width, image2.width)
	const height = Math.max(image1.height, image2.height)
	return { width, height }
}
