import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default ({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
	return defineConfig({
		plugins: [sveltekit()],
		optimizeDeps: {
		  include: ['mapbox-gl'],
		},
		server: {
			proxy: {
				'/api': { 
					target: process.env.VITE_PUBLIC_API_URL,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ''),
				},
			},
			cors:false
		},
	});

}