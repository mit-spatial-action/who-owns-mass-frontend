import { API_TOKEN } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, fetch }) => {
    const query = url.searchParams.get('query');
    if (!query) return json([]);

    const response = await fetch(`/api/owners/?search=${query}`, {
        headers: { 'Authorization': `Token ${API_TOKEN}` }
    });

    if (!response.ok) {
        return json({ error: 'Failed to fetch' }, { status: response.status });
    }
    const data = await response.json();
    return json({ suggestions: data });
}

