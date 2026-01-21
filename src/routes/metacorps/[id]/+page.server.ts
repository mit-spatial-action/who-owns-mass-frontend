import type { PageServerLoad } from './$types';
import { API_TOKEN } from '$env/static/private';

export const load: PageServerLoad = async ({ params, fetch }) => {
    const { id } = params;
    const response = await fetch(`/api/metacorps/${id}/`, {
        headers: {
            'Authorization': `Token ${API_TOKEN}`
        }
    })
    if (response.ok) {
        const data = await response.json();
        return { 
            metacorp: data,
            geojson: data.sites,
            seo: {
                title: data.name,
                description: `We found up to ${data.unit_count} units and ${data.prop_count} properties owned by ${data.name}`
            }
        }
    }
};