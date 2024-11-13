import adapter from '@sveltejs/adapter-netlify';
import { sveltePreprocess } from 'svelte-preprocess';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { mdsvex } from 'mdsvex';
import path from 'path';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md', '.mdx'],
	layout: {
		// titled: './src/lib/layouts/titled.svelte'
	},
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md', '.mdx'],
	preprocess: [
		sveltePreprocess(),
		vitePreprocess(), 
		mdsvex(mdsvexOptions)
	],
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		csrf: {
			checkOrigin: false
		},
		alias: {
			$lib: path.resolve('src/lib'),
			$types: path.resolve('src/types'),
		}
	},
};
export default config;
