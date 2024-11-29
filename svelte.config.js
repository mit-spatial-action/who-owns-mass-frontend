import adapter from '@sveltejs/adapter-netlify';
import { sveltePreprocess } from 'svelte-preprocess';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { mdsvex } from 'mdsvex';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.svx'],
	kit: {
		adapter: adapter(),
		csrf: {
			checkOrigin: false
		},
		alias: {
			$lib: path.resolve('src/lib'),
			$types: path.resolve('src/types'),
		}
	},
	preprocess: [
		mdsvex(),
		sveltePreprocess(),
		vitePreprocess()
	]
};
export default config;
