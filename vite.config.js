import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default ({ mode }) => {
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
					target: process.env.VITE_PUBLIC_SERVER_URL,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ''),
				},
			},
			cors:false
		},
	});

}
