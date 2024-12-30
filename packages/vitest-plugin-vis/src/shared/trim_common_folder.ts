/**
 * Trim off common folder such as `src` or `tests` from the test file path.
 * This is used to generate the default snapshot sub-path.
 */
export function trimCommonFolder(suiteName: string) {
	const suiteDir = suiteName.split('/', 1)[0]!
	if (['tests', 'test', 'src', 'source', 'js', 'ts', 'lib'].includes(suiteDir))
		return suiteName.slice(suiteDir.length + 1)
	return suiteName
}
