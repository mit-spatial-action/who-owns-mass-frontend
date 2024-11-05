import { getFromApi } from "$lib/scripts/apiCalls.js";
import { PUBLIC_API_URL } from '$env/static/public';

export const load = async ({ params, fetch }) => {
    let { id } = params;
    const metaCorpData = await getFromApi(fetch, PUBLIC_API_URL, 'meta', id);
    return { 
        metaCorpData 
    }
};