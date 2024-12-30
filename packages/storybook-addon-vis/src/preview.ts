import type { ProjectAnnotations, Renderer } from 'storybook/internal/types'
import { commands } from './client/@vitest/browser/context.ts'

const preview: ProjectAnnotations<Renderer> = {
	async beforeAll() {
		await commands.setupVisSuite()
	},
}

export default preview
