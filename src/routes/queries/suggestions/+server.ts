import { getFromApi } from "$lib/scripts/utils";
import { API_TOKEN } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url}) => {
    const query = url.searchParams.get('query') || '';
    if (!query) return json({ suggestions: [] });

    try {
        const suggestions = await getFromApi(fetch, '/api', API_TOKEN, 'owners', query);
        return json({ suggestions });
    } catch (error) {
        return json({ error: 'Failed to fetch suggestions' }, { status: 500 });
    }
}

