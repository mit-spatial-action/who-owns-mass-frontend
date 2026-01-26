import type { RequestHandler } from '@sveltejs/kit';

const site: string = 'https://who-owns-mass.org';
interface Url {
    url: string;
    lastMod: string;
}
const pages: Url[] = [
	{
		url: '',
		lastMod: '2025-07-22'
	},
	{
		url: 'who-we-are',
		lastMod: '2025-07-22'
	}
];

export const GET: RequestHandler = async ({ url }) => {
	const body = sitemap(pages);
	const response = new Response(body);
	response.headers.set('Cache-Control', 'max-age=0, s-maxage=3600');
	response.headers.set('Content-Type', 'application/xml');
	return response;
};

const sitemap = (pages: Url[]) => `<?xml version="1.0" encoding="UTF-8" ?>
<urlset
	xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
	xmlns:xhtml="https://www.w3.org/1999/xhtml"
	xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
	xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
	xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
	xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
>
  ${pages
	.map(
		(page) => `
  <url>
    <loc>${site}/${page.url}</loc>
    <changefreq>weekly</changefreq>
    <lastmod>${page.lastMod}</lastmod>
    <priority>0.5</priority>
  </url>
  `
	)
	.join('')}
</urlset>`;