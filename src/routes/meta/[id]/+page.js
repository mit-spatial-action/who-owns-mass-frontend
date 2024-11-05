import { getFromApi } from "$lib/scripts/utils.js";

export const load = async ({ params, fetch }) => {
    let { id } = params;
    const metaCorpData = await getFromApi(fetch, '/api', 'meta', id);
    return { 
        metaCorpData 
    }
};