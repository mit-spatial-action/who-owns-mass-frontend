import { getFromApi } from "$lib/scripts/apiCalls.js";
const apiUrl = import.meta.env.VITE_PUBLIC_SERVER_URL;

export const load = async ({ params, fetch }) => {
    const { id } = params;
    const siteData = await getFromApi(fetch, apiUrl, 'site', id);
    return { 
        siteData 
    }
};