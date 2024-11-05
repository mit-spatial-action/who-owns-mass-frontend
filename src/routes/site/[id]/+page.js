import { getFromApi } from "$lib/scripts/apiCalls.js";
import { PUBLIC_API_URL } from '$env/static/public';

export const load = async ({ params, fetch }) => {
    const { id } = params;
    const siteData = await getFromApi(fetch, PUBLIC_API_URL, 'site', id);
    return { 
        siteData 
    }
};