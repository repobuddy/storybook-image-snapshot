export function isSameSize(image1: { width: number; height: number }, image2: { width: number; height: number }) {
	return image1.width === image2.width && image1.height === image2.height
}
