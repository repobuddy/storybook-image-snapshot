import type { Meta, StoryObj } from '@storybook/react'
import { UNI_PNG_BASE64, UNI_PNG_URL } from '../testing/constants.js'
import { toDataURL, toImageData } from './image_data.js'

export default {
	title: 'ImageData',
} satisfies Meta

export const ConversionRoundtrip: StoryObj = {
	render: () => {
		return (
			<div>
				<img style={{ width: 128, height: 128 }} src={UNI_PNG_URL} />
				<canvas data-testid="canvas" width={128} height={128} />
				<img data-testid="img" width={128} height={128} />
			</div>
		)
	},
	async play({ canvas }) {
		const c = canvas.getByTestId<HTMLCanvasElement>('canvas')
		const ctx = c.getContext('2d')!

		const imageData = await toImageData(UNI_PNG_BASE64)
		ctx.putImageData(imageData, 0, 0)
		const dataURL = await toDataURL(imageData)

		const img = canvas.getByTestId<HTMLImageElement>('img')
		img.src = dataURL
	},
}
