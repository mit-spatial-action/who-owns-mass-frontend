

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';
import type { FeatureCollection, Feature } from "geojson";
import bbox from "@turf/bbox";
import { appState } from "$lib/state.svelte.ts";
import { primary } from "$lib/styles/_variables";

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
    filter: (item) => {
        return item.context.some((i) => {
            return (
                i.id.split('.').shift() === 'region' &&
                i.text === 'Massachusetts'
            );
        });
    }
});

const animateProperty = (
    layerId:string,
    property:string,
    end:number,
    duration:number,
    delay:number = 100) => {
    let start = appState.map.getPaintProperty(layerId, property);
    let delta = (end - start);
    // let step = delta * (delay / duration);
    let step = delta * (delay / duration);
    let progress = 0;
    let val = start;
    return setInterval(() => {
        appState.map.setPaintProperty(layerId, property, val);
        val += step
        progress += step
        // console.log(val)
        if (Math.abs(progress) >= Math.abs(delta)) {
            val = start;
            progress = 0;
        }
    },
    duration
    )
}

const clearLayers = async (layerIds:string[]) => {
    layerIds.forEach((layerId) => {
        if (typeof appState.map.getLayer(layerId) !== "undefined") {
            appState.map.removeLayer(layerId);
        }
        if (typeof appState.map.getSource(layerId) !== "undefined") {
            appState.map.removeSource(layerId);
        }
    })
};

let intervals = {
    circles: [],
    markers: [],
};

const animateCircles = (
    layerId:string) => {
    intervals.circles.push(animateProperty(layerId, 'circle-radius', 50, 1000))
    intervals.circles.push(animateProperty(layerId, 'circle-opacity', 0, 1000))
}

const clearIntervals = (intervalArray: NodeJS.Timeout[]) => {
    intervalArray.forEach((interval) => {
        clearInterval(interval);
    })
}

export const addMarkers = async (
    geojson:FeatureCollection|Feature,
    layerId:string,
    color:string) => {
    await clearLayers([layerId])
    appState.map.addLayer({
        id: layerId,
        source: {
            type: 'geojson',
            data: geojson
        },
        type: 'symbol',
        layout: {
            'text-field': '\u25BC',
            'text-size': 64,
            'text-offset': [0, -0.25],
            'text-anchor': "center",
            'text-allow-overlap': true,
            'text-ignore-placement': true
        },
        paint: {
            'text-halo-color': 'white',
            'text-halo-width': 1.5,
            'text-color': color,
            'text-halo-blur': 1
        }
    });
    // pointerEvents(map, layerId, true);
}

export const addCircles = async (
    geojson:FeatureCollection|Feature,
    layerId:string,
    color:string) => {
    await clearLayers([layerId])
    // clearIntervals(intervals.circles);
    appState.map.addLayer({
        id: layerId,
        source: {
            type: 'geojson',
            data: geojson
        },
        type: 'circle',
        paint: {
            "circle-radius": 0,
            "circle-pitch-alignment": "map",
            "circle-color": color,
            "circle-opacity": 1
        }
    });
    // animateCircles(layerId);
}

export const addGeoJSONLayer = async (
    geojson:FeatureCollection|Feature) => {
    if(Object.keys(geojson).length > 1) {
        await addCircles(geojson, "selectedCircles", primary);
        await addMarkers(geojson, "selectedMarkers", primary);
        let jsonBbox = bbox(geojson);
        appState.map.fitBounds(jsonBbox, {
            padding: 50,
            pitch: 45,
            bearing: -45,
            animate: true,
            // duration: initZoomDur
        });
    };
}

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
        queryUrl = `${apiUrl}/${endpoint}/${id}`;
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