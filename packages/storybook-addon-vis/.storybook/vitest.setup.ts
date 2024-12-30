import { setProjectAnnotations } from '@storybook/react'
import { beforeAll } from 'vitest'
import * as visPreview from '../src/preview.ts'
import { createVisConfig } from '../src/vitest-setup.ts'
import * as projectAnnotations from './preview.ts'

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
const project = setProjectAnnotations([projectAnnotations, visPreview])

beforeAll(project.beforeAll)

createVisConfig().presets.basic()
