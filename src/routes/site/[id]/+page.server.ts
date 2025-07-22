import { getFromApi } from "$lib/scripts/utils";
import type { PageServerLoad } from './$types';
import { API_TOKEN } from '$env/static/private';

export const load: PageServerLoad = async ({ params, fetch }) => {
    const { id } = params;
    const siteData = await getFromApi(fetch, '/api', API_TOKEN, 'sites', id);
    return { 
        siteData,
        seo: {
			title: siteData.properties.address.addr,
			description: `${siteData.properties.address.addr} is owned by ${siteData.properties.owners[0].properties.name} (potentially among others).`
		}
    }
};