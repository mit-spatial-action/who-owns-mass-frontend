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

export const getFromApi = async (loadFetch, apiUrl, endpoint, siteId, format="json") => {
    loadState.set(true);
    let queryUrl = `${apiUrl}/${endpoint}/${siteId}/?format=${format}`;
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
            return data
        })
        .catch(() => {
            loadState.set(false);
            return {}
        });
        
};