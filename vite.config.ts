import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv, type UserConfig } from 'vite';

export default defineConfig(({ mode }): UserConfig => {
	const env = loadEnv(mode, process.cwd(), '');

	process.env = { ...process.env, ...env };
	
	return defineConfig({
		plugins: [sveltekit()],
		optimizeDeps: {
		  include: ['mapbox-gl'],
		},
	});
});