import mapbox from 'mapbox-gl';
import { goto, invalidate } from '$app/navigation';
import { loadState } from "$lib/scripts/stores";

// const key = Symbol();

export { mapbox };

export const siteNav = async (id: number) => {
    await goto(
                `/site/${id}`
            );
    await invalidate('site');
}

export const getFromApi = async (
    loadFetch: Function, 
    apiUrl: string, 
    endpoint: string, 
    id: string | number, 
    format="json"
    ) => {
    loadState.set(true);
    let queryUrl: string = `${apiUrl}/${endpoint}/${id}/?format=${format}`;
    return await loadFetch(queryUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((response: Response) => {
            let json = response.json();
            return json
        })
        .then((data: object) => {
            loadState.set(false);
            return data
        })
        .catch(() => {
            loadState.set(false);
            return {}
        });
        
};