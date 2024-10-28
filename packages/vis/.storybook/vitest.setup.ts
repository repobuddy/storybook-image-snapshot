import { type StoryContext, setProjectAnnotations } from '@storybook/react'
import { page } from 'storybook-addon-vis'
import { afterEach, beforeAll, beforeEach, expect } from 'vitest'
import { configureSnapshotBeforeAll, configureSnapshotBeforeEach, shouldTakeSnapshot } from '../src/vitest-setup.js'
import * as projectAnnotations from './preview'

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
const project = setProjectAnnotations([projectAnnotations])

beforeAll((suite) => {
	project.beforeAll()
	configureSnapshotBeforeAll(suite)
})

beforeEach((ctx) => {
	configureSnapshotBeforeEach(ctx)
})

afterEach<{ story?: StoryContext }>(async (ctx) => {
	if (!shouldTakeSnapshot(ctx)) return
	const r = await page.imageSnapshot()
	await expect(r).toMatchImageSnapshot()
})
