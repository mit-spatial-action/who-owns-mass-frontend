<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { siteNav, mapbox } from "$lib/scripts/utils";
    import type { FeatureCollection, Feature } from "geojson";
   
    import bbox from "@turf/bbox";
    /* Helper functions */  
    // import { drawNetwork, drawNetworkPoints }  from "$lib/components/Map/helper-functions/DrawNetwork.js";

    import site_data from "$lib/config/instance.json";
    import "mapbox-gl/dist/mapbox-gl.css";

    import Device from "svelte-device-info";
    import {
        site,
        metacorp,
        loadState,
        homeState,
        homeState,
        gcResult
    } from "$lib/stores";

    export let mapbox_token: string;

    let mobile:boolean = false;
    let mobile:boolean = false;

    mapbox.accessToken = mapbox_token;
    mapbox.accessToken = mapbox_token;

    let map_config = site_data.map;

    export let style = map_config.style;
    export let projection = map_config.projection;
    export let initLngLat = new mapbox.LngLat(
        map_config.init.lngLat[0],
        map_config.init.lngLat[1]
    );
    export let initZoom = map_config.init.zoom;
    export let initZoomDur = map_config.init.zoomDur; //change back to 3000 after dev
    export let maxBounds = map_config.maxBounds;
    export let resultZoom = map_config.resultZoom;

    let map: mapboxgl.Map;

    let markers: mapboxgl.Marker[] = [];

    const removeAllMarkers = () => {
        markers.forEach(marker => marker.remove()); // Remove each marker
        markers.length = 0; // Clear the array
    }

    const addMarker = (coords) => {
        if (map) {
            const marker = new mapbox.Marker({
                    color: "#FF5F05"
                    })
                .setLngLat(coords)
                .addTo(map);

            markers.push(marker); // Add marker to the array
        }
    }

    let map: mapboxgl.Map;

    let markers: mapboxgl.Marker[] = [];

    const removeAllMarkers = () => {
        markers.forEach(marker => marker.remove()); // Remove each marker
        markers.length = 0; // Clear the array
    }

    const addMarker = (coords) => {
        if (map) {
            const marker = new mapbox.Marker({
                    color: "#FF5F05"
                    })
                .setLngLat(coords)
                .addTo(map);

            markers.push(marker); // Add marker to the array
        }
    }


    const flyToLngLat = (lngLat: mapboxgl.LngLat, zoom: number = resultZoom) => {
        map.flyTo({
            center: lngLat,
            zoom: map.getZoom() > zoom ? map.getZoom() : zoom,
            duration: initZoomDur,
            essential: true,
            bearing: -45,
            pitch: 45
        });
    }

    const flyToQuery = async (gcResult) => {
        if (map && gcResult) {
            let resultSiteId: string | number;
            loadState.set(true);
            map.once('idle', async (e: Event) => {
                let features = map.queryRenderedFeatures({
                    layers: ["sites"],
                });
                if (features.length > 0) {
                    let selected = features.filter(feature => feature.properties.addr.toUpperCase() === gcResult.address.toUpperCase())
                    if (selected.length > 0) {
                        await siteNav(selected[0].properties.site_id);
                    } else {
                        resultSiteId = null;
                    }
                    resultSiteId = null;
                }
                loadState.set(false);
                return resultSiteId
            })
            flyToLngLat(gcResult.lngLat)
        }
    }

    const pointerEvents = (name: string) => {
        if (map) {
            map.on('mouseenter', name, () => {
                    map.getCanvas().style.cursor = 'pointer';
                });

            map.on('mouseleave', name, () => {
                map.getCanvas().style.cursor = '';
            });
        }
    }

    const clearLayersSources = async (names) => {
        console.log("clearing all layers");
        if (map){
            removeAllMarkers();
            names.forEach((name) => {
                if (typeof map.getLayer(`selected${name}Layer`) !== "undefined") {
                    console.log(`Clearing selected${name}Layer`)
                    map.removeLayer(`selected${name}Layer`);
                    map.removeSource(`selected${name}`);
                }
            })
        }
    }

    const oneOrManyMarkers = (geojson) => {
        if (geojson.type === "FeatureCollection") {
            geojson.features.forEach((feature) => {
                const { coordinates } = feature.geometry;
                const { title } = feature.properties;
                addMarker(coordinates);
            });
        } else {
            console.log("hellO")
            const { coordinates } = geojson.geometry;
            addMarker(coordinates);
        }
    }

    const getLabelLayerId = () => {
        const layers = map.getStyle().layers;
        return layers.find(
            (layer) => layer.type === 'symbol' && layer.layout['text-field']
        ).id;
    }

    const renderGeoJSONLayer = async (geojson: FeatureCollection | Feature, name: string) => {
        console.log("Triggering renderGeoJSONLayer")
        if(geojson && map){
            if(Object.keys(geojson).length > 1) {
                await clearLayersSources(["Site", "MetaCorp"])
                map.addSource(`selected${name}`, {
                    'type': 'geojson',
                    'data': geojson
                });
                map.addLayer({
                    id: `selected${name}Layer`,
                    source: `selected${name}`,
                    type: 'circle',
                    paint: {
                        "circle-radius": 1,
                        "circle-color": "#FF5F05",
                        "circle-opacity": 1
                    }
                });

                oneOrManyMarkers(geojson);
                
                // let radius = 1
                // let opacity = 1;
                // const opacityStep = 0.05
                // setInterval(() => {
                //     map.setPaintProperty(`selected${name}Layer`, 'circle-radius', radius);
                //     radius = (radius + 1) % 20;
                //     map.setPaintProperty(`selected${name}Layer`, 'circle-opacity', opacity);
                //     opacity -= opacityStep;

                //     if (opacity <= 0) {
                //         opacity = 1;
                //     }
                // }, 30);
                
                pointerEvents(name);

                let jsonBbox = bbox(geojson);
                map.fitBounds(jsonBbox, {
                    padding: 50,
                    pitch: 45,
                    bearing: -45
                });
            }
        }
    }

    // Function to toggle the layer visibility
    const toggleLayerVisibility = (condition, layerId) => {
        if (map) {
            if (!condition) {
                console.log("visibility off");
                // Set the visibility to 'none' to hide the layer
                map.setLayoutProperty(layerId, 'visibility', 'none');
            } else {
                // Set the visibility to 'visible' to show the layer
                map.setLayoutProperty(layerId, 'visibility', 'visible');
            }
        }
    }
    
    loadState.set(true);
    $: flyToQuery($gcResult);
    $: renderGeoJSONLayer($metacorp.sites, "MetaCorp"); 
    $: renderGeoJSONLayer($site, "Site");
    // $: toggleLayerVisibility($homeState, "hexes");

    onMount(() => {
        mobile = Device.isPhone;
        let mapOptions = {
            container: "map",
            style: style,
            center: initLngLat,
            zoom: initZoom.length === 2 ? initZoom[0] : initZoom,
            bearing: -60,
            pitch: 65,
            projection: projection,
            maxBounds: maxBounds,
            maxZoom: resultZoom
        };
        map = new mapbox.Map(mapOptions);

        map.on("load", async () => {
            map.addSource("sites", {
                type: "vector",
                url: "mapbox://mit-spatial-action.who-owns-mass-sites",
            });

            map.addLayer({
                id: "sites",
                source: "sites",
                maxZoom: resultZoom,
                "source-layer": "geographies",
                type: "circle",
                paint: {
                    "circle-radius": 5,
                    "circle-color": "#3CAAA9",
                    "circle-opacity": [
                        'interpolate',
                        ['exponential', 0.5],
                        ['zoom'],
                        resultZoom - 4,
                        0,
                        // When zoom is 18 or higher, buildings will be 100% opaque.
                        resultZoom,
                        1
                    ],
                },
            });
        });

        const popup = new mapbox.Popup({
            closeButton: true,
            closeOnClick: true
        });

        map.on('mouseenter', 'sites', (e) => {

            const coordinates = e.features[0].geometry.coordinates.slice();
            const address = e.features[0].properties.addr;
            const own_name = e.features[0].properties.own_name;
            const muni = e.features[0].properties.muni;

            let popupHTML = "<p><strong>"+address+"</strong></p>"
            popupHTML += "<p>"+own_name+"</p>"
            popupHTML += "<p>"+muni+", MA</p>"

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            popup.setLngLat(coordinates).setHTML(popupHTML).addTo(map);
        })


        map.once("zoomend", () => {
            loadState.set(false);
            // map.setMinZoom(initZoom.length === 2 ? initZoom[1] : initZoom);
        });

        map.on("style.load", () => {
            map.on("click", "sites", async (e) => {
                var feature = e.features[0];
                await siteNav(feature.properties.site_id)
            });

            const labelLayerId = getLabelLayerId();
            map.addSource("hexes", {
                type: "vector",
                url: "mapbox://mit-spatial-action.who-owns-mass-hexes",
            });

            map.addLayer({
                id: "hexes",
                source: "hexes",
                maxZoom: resultZoom,
                "source-layer": "geographies",
                type: "fill-extrusion",
                filter: ['==', ['get', 'size'], 0.5],
                paint: {
                    "fill-extrusion-height": [
                        'interpolate',
                        ['exponential', 1.5],
                        ['get', 'prop_count_mean_ntile'],
                        0, 0,
                        5, 3000
                    ],
                    "fill-extrusion-color": [
                        'interpolate',
                        ['exponential', 1.5],
                        ['get', 'prop_count_mean_ntile'],
                        0, 'white',
                        // When zoom is 18 or higher, buildings will be 100% opaque.
                        5, "#3CAAA9"
                    ],
                    'fill-extrusion-opacity': 0.9
                    // "circle-opacity": [
                    //     'interpolate',
                    //     ['exponential', 0.5],
                    //     ['zoom'],
                    //     resultZoom - 4,
                    //     0,
                    //     // When zoom is 18 or higher, buildings will be 100% opaque.
                    //     resultZoom,
                    //     1
                    // ],
                },
            },
            labelLayerId);

            map.on('zoom', function() {
                const zoomLevel = map.getZoom();  // Get the current zoom level

                if (zoomLevel < 12 && $homeState) {
                    // Show the layer when zoom level is greater than the threshold
                    map.setLayoutProperty('hexes', 'visibility', 'visible');
                } else {
                    // Hide the layer when zoom level is less than or equal to the threshold
                    map.setLayoutProperty('hexes', 'visibility', 'none');
                }
            });

            map.addLayer(
                {
                id: '3d-buildings',
                source: 'composite',
                'source-layer': 'building',
                filter: ['==', 'extrude', 'true'],
                type: 'fill-extrusion',
                minzoom: 15,
                paint: {
                    'fill-extrusion-color': '#fff',
                    'fill-extrusion-height': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15,
                    0,
                    15.05,
                    ['get', 'height']
                    ],
                    'fill-extrusion-base': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15,
                    0,
                    15.05,
                    ['get', 'min_height']
                    ],
                    'fill-extrusion-opacity': 1
                }
                },
                labelLayerId
            );

            pointerEvents("sites");

            map.setFog({
                range: [0.25, 2],
                color: "#fff",
                "high-color": "#fff",
                "horizon-blend": 0.1, // default: .1
                "space-color": "#3CAAA9",
                "star-intensity": 0.1,
            });
            if (initZoom.length === 2) {
                map.flyTo({
                    center: initLngLat,
                    zoom: initZoom[1],
                    duration: initZoomDur,
                    essential: true,
                });
            }
        });
    });

    onDestroy(() => {
        if (map) {
            map.remove();
        }
    });

</script>

<div
    id="map"
    class={mobile ? "non-interactive" : null}
>
</div>

<style>
    .non-interactive {
        pointer-events: none;
    }
    #map {
        height: 100%;
        width: 100%;
    }
</style>