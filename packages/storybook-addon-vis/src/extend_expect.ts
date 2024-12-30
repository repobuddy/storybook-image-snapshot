import { expect } from 'vitest'
import './augment.ts'
import { toMatchImageSnapshot } from './client/expect.to_match_image_snapshot.ts'
import { toMatchImageSnapshot2 } from './client/to_match_image_snapshot/to_match_image_snapshot.ts'

expect.extend({ toMatchImageSnapshot, toMatchImageSnapshot2 })
