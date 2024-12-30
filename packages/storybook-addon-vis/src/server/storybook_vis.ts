import type { Plugin } from 'vitest/config'
import type { VisOptions } from '../shared/types.ts'
import { copyFile } from './commands/copy_file.ts'
import { existDir } from './commands/exist_dir.ts'
import { existFile } from './commands/exist_file.ts'
import { getSnapshotPlatform } from './commands/get_snapshot_platform.ts'
import { imageSnapshot } from './commands/image_snapshot.ts'
import { isCI } from './commands/is_ci.ts'
import { matchImageSnapshot } from './commands/match_image_snapshot.ts'
import { rmDir } from './commands/rm_dir.ts'
import { setupVisSuite } from './commands/setup_vis_suite.ts'
import { visContext } from './vis_context.ts'

export function storybookVis(options: VisOptions = {}) {
	visContext.setOptions(options)
	return {
		name: 'vitest:storybook-addon-vis',
		config() {
			return {
				test: {
					browser: {
						name: undefined as unknown as string,
						commands: {
							existDir,
							existFile,
							copyFile,
							rmDir,
							isCI,
							getSnapshotPlatform,
							setupVisSuite,
							matchImageSnapshot,
							imageSnapshot,
						},
					},
				},
			}
		},
	} satisfies Plugin
}
