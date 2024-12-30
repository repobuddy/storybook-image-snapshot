import { expect, it } from 'vitest'
import { page } from '../../../index.ts'
import { RESULT_DIR } from '../../../shared/contants.ts'
import { toSnapshotId } from './image_snapshot.logic.ts'

it(`save file under ${RESULT_DIR}`, async ({ task }) => {
	const prefix = task.file.projectName === 'vis:wb' ? 'wb/' : ''
	const f1 = await page.imageSnapshot()
	const filename = task.file.name.slice('src/'.length)
	const snapshotId = toSnapshotId(task.name)
	expect(f1.resultPath).toMatch(`../../../__vis__/${RESULT_DIR}/${prefix}${filename}/${snapshotId}-1.png`)

	const f2 = await page.imageSnapshot()
	expect(f2.resultPath).toMatch(`../../../__vis__/${RESULT_DIR}/${prefix}${filename}/${snapshotId}-2.png`)
})
