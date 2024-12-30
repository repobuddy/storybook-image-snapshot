export function toImageData(base64: string) {
	return new Promise<{
		data: Uint8ClampedArray
		width: number
		height: number
		colorSpace: PredefinedColorSpace
	}>((resolve, reject) => {
		const img = new Image()
		img.src = `data:image/png;base64,${base64}`

		img.onload = () => {
			const canvas = document.createElement('canvas')
			canvas.width = img.width
			canvas.height = img.height
			const ctx = canvas.getContext('2d')!
			ctx.drawImage(img, 0, 0)
			resolve(ctx.getImageData(0, 0, canvas.width, canvas.height))
		}

		img.onerror = () => {
			reject(new Error('Failed to load image'))
		}
	})
}

export async function toDataURL(imageData: ImageData) {
	const canvas = document.createElement('canvas')
	canvas.width = imageData.width
	canvas.height = imageData.height
	const ctx = canvas.getContext('2d')!
	ctx.putImageData(imageData, 0, 0)
	return new Promise<string>((resolve) => {
		canvas.toBlob((blob) => {
			const reader = new FileReader()
			reader.onload = () => {
				resolve(reader.result as string)
			}
			reader.readAsDataURL(blob!)
		})
	})
}
