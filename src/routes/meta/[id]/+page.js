import { getFromApi } from "$lib/scripts/apiCalls.js";
const apiUrl = import.meta.env.VITE_PUBLIC_SERVER_URL;

export const load = async ({ params, fetch }) => {
    let { id } = params;
    const metaCorpData = await getFromApi(fetch, apiUrl, 'meta', id);
    return { 
        metaCorpData 
    }
};