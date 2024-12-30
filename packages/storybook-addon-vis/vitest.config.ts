import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
	test: {
		coverage: {
			include: ['src/**/*.{js,mjs,cjs,ts,jsx,tsx,cts,mts}'],
			exclude: [
				'**/*.{spec,test,unit,accept,integrate,system,study,perf,stress}.{js,jsx,cjs,mjs,ts,tsx,cts,mts}',
				'**/*.{spec,test,unit,accept,integrate,system,study,perf,stress}.*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}',
				'**/*.stories.{js,mjs,jsx,tsx}',
			],
		},
	},
})
