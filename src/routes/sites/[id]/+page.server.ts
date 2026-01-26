import type { PageServerLoad } from './$types';
import { API_TOKEN } from '$env/static/private';

export const load: PageServerLoad = async ({ params, fetch }) => {
    const { id } = params;
    const response = await fetch(`/api/sites/${id}/`, {
        headers: {
            'Authorization': `Token ${API_TOKEN}`
        }
    })
    if (response.ok) {
        const data = await response.json();
        return { 
            site: data.properties,
            geojson: data,
            seo: {
                title: data.properties.address.addr,
                description: `${data.properties.address.addr} is owned by ${data.properties.owners[0].properties.name} (potentially among others).`
            }
        }
    }
    return { 
        site: {}, 
        seo: { title: "Not Found", description: "Property could not be found." } 
     };
};