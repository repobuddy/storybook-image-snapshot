// @ts-nocheck
it('should be available in global expect', () => {
	expect(typeof expect('something').toMatchImageSnapshot2).toBe('function')
})
