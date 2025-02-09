import type { SnapshotMeta } from 'vitest-plugin-vis'
// `storybook-addon-vis/vitest-setup` provides code needed in `vitest.setup.ts`.
import { createVis } from 'vitest-plugin-vis/setup'
import { commands } from './client/vitest_proxy.ts'

export const vis = createVis<SnapshotMeta<any> & { tags: string[] }>(commands)
