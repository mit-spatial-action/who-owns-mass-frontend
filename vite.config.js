import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
export default ({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
	return defineConfig({
		plugins: [sveltekit()],
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@import '$lib/styles/variables';`
				}
			}
		},
		server: {
			proxy: {
				'/api': {
					target: process.env.VITE_SERVER_URL,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ''),
				},
			},
		},
	});

}
