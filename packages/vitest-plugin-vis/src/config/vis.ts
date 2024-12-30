import type { Plugin } from 'vite'
import { commands } from '../server/commands/extend.ts'
import { visContext } from '../server/vis_context.ts'
import { NAME } from '../shared/constants.ts'
import type { VisOptions } from './types.ts'

/**
 * Create a Vite plugin for visual testing.
 *
 * If options are not provided, the plugin will use the default options,
 * which enables the `auto` preset.
 */
export function vis(options: VisOptions = { preset: 'auto' }) {
	visContext.setOptions(options)
	const preset = options?.preset
	return {
		name: NAME,
		config() {
			return {
				test: {
					browser: {
						name: undefined as unknown as string,
						commands,
					},
					setupFiles: preset && preset !== 'none' ? [`vitest-plugin-vis/presets/${preset}`] : undefined,
				},
			}
		},
	} satisfies Plugin
}
