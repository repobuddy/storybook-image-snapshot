export interface BrowserApi {
	takeScreenshot(
		filePath: string,
		selector: string,
		options:
			| {
					timeout?: number | undefined
			  }
			| undefined,
	): Promise<string>
}
