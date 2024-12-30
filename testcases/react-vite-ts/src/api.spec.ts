import { commands } from 'storybook-addon-vis'
import { expect, it } from 'vitest'

it('should not expose internal commands', () => {
	expect(commands).to.not.have.property('setupVisSuite')
})
