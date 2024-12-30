import { expect, it } from 'vitest'
import { cdp, commands, page, server } from './context.ts'

it('is accessible in vitest', () => {
	expect(page).toBeDefined()
	expect(commands).toBeDefined()
	expect(server).toBeDefined()
})

it('can access cdp (Chrome DevTools Protocol session)', () => {
	expect(cdp()).toBeDefined()
})
