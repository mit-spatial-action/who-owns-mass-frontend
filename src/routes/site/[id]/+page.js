import { getFromApi } from "$lib/scripts/utils.js";

export const load = async ({ params, fetch }) => {
    const { id } = params;
    const siteData = await getFromApi(fetch, '/api', 'site', id);
    return { 
        siteData 
    }
};