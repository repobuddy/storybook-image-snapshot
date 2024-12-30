export function toSnapshotId(taskName: string) {
	return `${taskName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`
}
