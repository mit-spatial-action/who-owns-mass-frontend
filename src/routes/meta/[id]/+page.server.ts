import { getFromApi } from "$lib/scripts/utils";
import type { PageServerLoad } from './$types';
import { API_TOKEN } from '$env/static/private';

export const load: PageServerLoad = async ({ params, fetch }) => {
    const { id } = params;
    const metaCorp = await getFromApi(fetch, '/api', API_TOKEN, 'metacorps', id);
    return { 
        metaCorp,
        seo: {
			title: metaCorp.name,
			description: `We found up to ${metaCorp.unit_count} units and ${metaCorp.prop_count} properties owned by ${metaCorp.name}`
		}
    }
};