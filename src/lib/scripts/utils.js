import mapbox from 'mapbox-gl';
import { goto, invalidate } from '$app/navigation';
import { loadState } from "$lib/scripts/stores.js";

const key = Symbol();

export { mapbox, key };

export const siteNav = async (id) => {
    await goto(
                `/site/${id}`
            );
    await invalidate('site');
}

export const getFromApi = async (loadFetch, apiUrl, endpoint, siteId) => {
    loadState.set(true);
    let queryUrl = `${apiUrl}/${endpoint}/${siteId}/`;
    return await loadFetch(queryUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((response) => {
            let json = response.json();
            return json
        })
        .then((data) => {
            loadState.set(false);
            console.log(`Fetched ${endpoint} ${siteId} from ${queryUrl}`);
            return data
        })
        .catch((error) => {
            loadState.set(false);
            console.log(error)
            return {}
        });
        
};