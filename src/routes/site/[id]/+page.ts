import { getFromApi } from "$lib/scripts/utils";
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
    const { id } = params;
    const siteData = await getFromApi(fetch, '/api', 'sites', id);
    return { 
        siteData 
    }
};