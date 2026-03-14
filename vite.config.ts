import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			'@aureuma/svelta-docs/appearance': path.resolve('./packages/core/src/lib/appearance/index.ts'),
			'@aureuma/svelta-docs/experience': path.resolve('./packages/core/src/lib/experience/index.ts'),
			'@aureuma/svelta-docs/server': path.resolve('./packages/core/src/lib/server/index.ts'),
			'@aureuma/svelta-docs': path.resolve('./packages/core/src/lib/index.ts')
		}
	},
	server: {
		fs: {
			strict: false,
			allow: [path.resolve('./packages'), path.resolve('./src'), path.resolve('./node_modules')]
		}
	}
});
