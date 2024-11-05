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
				'/api': { //Note: need to use "http://127.0.0.1:8000" in env - localhost is not working. 
					target: process.env.VITE_PUBLIC_API_URL,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ''),
				},
			},
			cors:false
		},
	});

}
