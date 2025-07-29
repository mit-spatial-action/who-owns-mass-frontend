

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';

export const geocoder = new MapboxGeocoder({
    accessToken: PUBLIC_MAPBOX_TOKEN,
    marker: false,
    countries: 'us',
    flyTo: false,
    types: 'address',
    bbox: [
        -73.507239199792,
        41.23908260581605,
        -69.92871308883089,
        42.88675909238091
    ],
    filter: function (item) {
        return item.context.some((i) => {
            return (
                i.id.split('.').shift() === 'region' &&
                i.text === 'Massachusetts'
            );
        });
    }
});

export const toTitleCase = (str) => {
  if (!str) return ""
  return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
}

export const getFromApi = async (
    loadFetch: Function, 
    apiUrl: string, 
    apiToken: string,
    endpoint: string, 
    id: string | number, 
    format="json"
    ) => {
    let queryUrl: string = "";

    if(endpoint=="owners"){
        queryUrl= `https://api.who-owns-mass.org/${endpoint}?search=${id}`; // only works when hardcoded - not recognizing the /api redirect. 
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
            return data
        })
        .catch(() => {
            return {}
        });
        
};