import mapbox from 'mapbox-gl';
import { goto } from '$app/navigation';
import { loadState } from "$lib/stores";
//import { API_TOKEN } from '$env/static/private';

export { mapbox };

export const siteNav = async (id: number) => {
    console.log("ID: " + `${id}`);
    await goto(
                `/site/${id}`
            );
}

export const getFromApi = async (
    loadFetch: Function, 
    apiUrl: string, 
    apiToken: string,
    endpoint: string, 
    id: string | number, 
    format="json"
    ) => {
    loadState.set(true);
    let queryUrl: string = "";
    console.log(endpoint);
    console.log(id);

    if(endpoint=="owners"){
        queryUrl= `https://api.who-owns-mass.org/${endpoint}?search=${id}`; // only works when hardcoded - not recognizing the /api redirect. 
        console.log(queryUrl);
    } else {
        queryUrl = `${apiUrl}/${endpoint}/${id}/?format=${format}`;
    }

    return await loadFetch(queryUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${apiToken}`
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