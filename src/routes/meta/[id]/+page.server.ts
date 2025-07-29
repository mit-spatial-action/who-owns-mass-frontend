import { getFromApi } from "$lib/scripts/utils";
import type { PageServerLoad } from './$types';
import { API_TOKEN } from '$env/static/private';

export const load: PageServerLoad = async ({ params, fetch }) => {
    const { id } = params;
    const metacorp = await getFromApi(fetch, '/api', API_TOKEN, 'metacorps', id);
    return { 
        metacorp,
        seo: {
			title: metacorp.name,
			description: `We found up to ${metacorp.unit_count} units and ${metacorp.prop_count} properties owned by ${metacorp.name}`
		}
    }
};