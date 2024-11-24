import ci from 'is-ci'

export interface GetSnapshotPlatformCommand {
	/**
	 * Get the platform id of the snapshot `{platform}[-ci]`.
	 *
	 * This is useful to control where the snapshot is stored.
	 */
	getSnapshotPlatform: () => Promise<string>
}

export async function getSnapshotPlatform() {
	return ci ? process.platform : 'local'
}
