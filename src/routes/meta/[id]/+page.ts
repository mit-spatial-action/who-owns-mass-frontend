import { getFromApi } from "$lib/scripts/utils";
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
    const { id } = params;
    const metaCorpData = await getFromApi(fetch, '/api', 'metacorps', id);
    return { 
        metaCorpData 
    }
};