import { expect, it } from 'vitest'
import { browserApi } from './browser_api.ts'

it('throws when provider is not playwright or webdriverio', () => {
	expect(() => browserApi({ provider: { name: 'some' } } as any)).toThrow('Unsupported provider: some')
})
