import { getFromApi } from "$lib/scripts/utils";
import type { PageLoad } from './$types';
import { API_TOKEN } from '$env/static/private';

export const load: PageLoad = async ({ params, fetch }) => {
    const { id } = params;
    const metaCorpData = await getFromApi(fetch, '/api', API_TOKEN, 'metacorps', id);
    return { 
        metaCorpData 
    }
};