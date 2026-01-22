import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import path from 'path';
import type { Config } from '@sveltejs/kit';

const config = {
	extensions: ['.svelte', '.svx'],
	kit: {
		adapter: adapter(),
		csrf: {
			trustedOrigins: []
		},
		alias: {
			$lib: path.resolve('src/lib'),
			$types: path.resolve('src/types'),
		}
	},
	preprocess: [
		mdsvex(),
		vitePreprocess()
	]
} satisfies Config;

export default config;
