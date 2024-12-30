export const createImageResizer =
	({ width, height }: { width: number; height: number }) =>
	(image: { width: number; height: number; data: Uint8ClampedArray; colorSpace: PredefinedColorSpace }) => {
		if (image.width === width && image.height === height) {
			return image
		}
		const inArea = (x: number, y: number) => y <= image.height && x <= image.width
		const data = new Uint8ClampedArray(width * height * 4)

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const idx = (width * y + x) << 2
				if (inArea(x, y)) {
					const old = (image.width * y + x) << 2
					data[idx] = image.data[old]
					data[idx + 1] = image.data[old + 1]
					data[idx + 2] = image.data[old + 2]
					data[idx + 3] = image.data[old + 3]
				} else {
					data[idx] = 0
					data[idx + 1] = 0
					data[idx + 2] = 0
					data[idx + 3] = 64
				}
			}
		}
		return { data, width, height, colorSpace: image.colorSpace }
	}

// slower
export const createImageResizer2 =
	({ width, height }: { width: number; height: number }) =>
	(image: { width: number; height: number; data: Uint8ClampedArray; colorSpace: PredefinedColorSpace }) => {
		if (image.width === width && image.height === height) {
			return image
		}
		const inArea = (x: number, y: number) => y <= image.height && x <= image.width
		const data = new Uint8ClampedArray(width * height * 4)

		const copyBytes = image.width * 4
		for (let y = 0; y < height; y++) {
			data.set(image.data.slice(y * image.width, copyBytes), y * width * 4)
			for (let x = image.width; x < width; x++) {
				const idx = (width * y + x) << 2
				if (!inArea(x, y)) {
					data[idx] = 0
					data[idx + 1] = 0
					data[idx + 2] = 0
					data[idx + 3] = 64
				}
			}
		}
		return { data, width, height, colorSpace: image.colorSpace }
	}
