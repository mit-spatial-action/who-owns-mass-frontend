import { getFromApi } from "$lib/scripts/utils";
import type { PageServerLoad } from './$types';
import { API_TOKEN } from '$env/static/private';

export const load: PageServerLoad = async ({ params, fetch }) => {
    const { id } = params;
    const site = await getFromApi(fetch, '/api', API_TOKEN, 'sites', id);
    return { 
        site: site.properties,
        geojson: site,
        seo: {
			title: site.properties.address.addr,
			description: `${site.properties.address.addr} is owned by ${site.properties.owners[0].properties.name} (potentially among others).`
		}
    }
};