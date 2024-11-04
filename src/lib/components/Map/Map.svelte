<script>
    import { onDestroy, onMount, setContext } from "svelte";
    import RippleLoader from "$lib/components/RippleLoader.svelte";
    import { goto, invalidate } from '$app/navigation';
    import { siteNav } from "$lib/scripts/utils";
   
    import bbox from "@turf/bbox";
    /* Helper functions */  
    // import { drawNetwork, drawNetworkPoints }  from "$lib/components/Map/helper-functions/DrawNetwork.js";

    import site_data from "$lib/config/instance.json";
    import "mapbox-gl/dist/mapbox-gl.css";

    import { mapbox } from "$lib/scripts/utils";

    import Device from "svelte-device-info";
    import {
        site,
        mapLoad,
        metacorp,
        loadState,
        gcResult
    } from "$lib/scripts/stores.js";

    let mobile;

    export let mapbox_token;

    mapbox.accessToken = mapbox_token;

    export let style = site_data.map.style;
    export let projection = site_data.map.projection;
    export let initLngLat = site_data.map.init.lngLat;
    initLngLat = new mapbox.LngLat(initLngLat[0], initLngLat[1]);
    export let initZoom = site_data.map.init.zoom;
    export let initZoomDur = site_data.map.init.zoomDur; //change back to 3000 after dev
    export let maxBounds = site_data.map.maxBounds;
    export let resultZoom = site_data.map.resultZoom;

    let map;
    let selected;

    function flyToLngLat(lngLat, zoom = resultZoom) {
        map.flyTo({
            center: lngLat,
            zoom: map.getZoom() > zoom ? map.getZoom() : zoom,
            duration: 0,
            essential: true,
        });
    }

    const flyToQuery = async () => {
        if (map) {
            let resultSiteId;
            loadState.set(true);
            map.once('idle', async (e) => {
                let features = map.queryRenderedFeatures({
                    layers: ["id"],
                });
                if (features.length > 0) {
                    let selected = features.filter(feature => feature.properties.addr.toUpperCase() === $gcResult.address.toUpperCase())
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
            flyToLngLat($gcResult.lngLat)
        }
    }

    const pointerEvents = (name) => {
        if (map) {
            map.on('mouseenter', name, () => {
                    map.getCanvas().style.cursor = 'pointer';
                });

            // Change it back to a pointer when it leaves.
            map.on('mouseleave', name, () => {
                map.getCanvas().style.cursor = '';
            });
        }
    }

    const renderGeoJSONLayer = (geojson, name) => {
        if(geojson && map){
            if(Object.keys(geojson).length > 1) {
                if (typeof map.getLayer(`selected${name}Layer`) !== "undefined") {
                    map.removeLayer(`selected${name}Layer`);
                    map.removeSource(`selected${name}`);
                }
                map.addSource(`selected${name}`, {
                    'type': 'geojson',
                    'data': geojson
                });
                map.addLayer({
                    id: `selected${name}Layer`,
                    source: `selected${name}`,
                    type: 'circle',
                    paint: {
                        "circle-radius": 10,
                        "circle-color": "blue",
                        "circle-opacity": 1
                    }
                });

                pointerEvents(name);

                let jsonBbox = bbox(geojson);
                map.fitBounds(jsonBbox, {
                    padding: 50
                });
            }
        }
    }
    
    $: flyToQuery($gcResult);
    $: renderGeoJSONLayer($metacorp.sites, "MetaCorp"); 
    $: renderGeoJSONLayer($site, "Site");

    onMount(() => {
        mobile = Device.isPhone;
        let mapOptions = {
            container: "map",
            style: style,
            center: initLngLat,
            zoom: initZoom.length === 2 ? initZoom[0] : initZoom,
            bearing: 0,
            projection: projection,
            maxBounds: maxBounds,
            maxZoom: resultZoom
        };
        map = new mapbox.Map(mapOptions);

        map.on("load", async () => {
            mapLoad.set(true);
            map.addSource("parcelPoints", {
                type: "vector",
                url: "mapbox://mit-spatial-action.companies_103120241149",
            });

            map.addLayer({
                id: "id",
                source: "parcelPoints",
                maxZoom: resultZoom,
                "source-layer": "geographies",
                type: "circle",
                paint: {
                    "circle-radius": 5,
                    "circle-color": "#FF5F05",
                    "circle-opacity": [
                        'interpolate',
                        ['exponential', 0.5],
                        ['zoom'],
                        resultZoom - 5,
                        0,
                        // When zoom is 18 or higher, buildings will be 100% opaque.
                        resultZoom,
                        1
                    ],
                },
            });
        });

        map.once("zoomend", () => {
            // loadState.set(!loadState);
            map.setMinZoom(initZoom.length === 2 ? initZoom[1] : initZoom);
        });

        map.on("style.load", () => {
            map.on("click", "id", async (e) => {

                var feature = e.features[0];
                await siteNav(feature.properties.site_id)

                // var network = drawNetwork(feature.geometry.coordinates);
                // var networkPoints = drawNetworkPoints();
                // Add network, if 1+ affiliated companies
                // if(network.features.length > 0){

                //     map.addSource('routes', {
                //         'type': 'geojson',
                //         'data': network
                //     });

                //     map.addSource('affiliates', {
                //         'type': 'geojson',
                //         'data': networkPoints
                //     });

                //     map.addLayer({
                //         id: "network",
                //         source: 'routes',
                //         type: 'line',
                //         paint: {
                //             'line-width': 1.5,
                //             'line-color': '#806cf9',
                //             'line-opacity': 0.8
                //         }
                //     });

                //     map.addLayer({
                //         id: "affiliates",
                //         source: 'affiliates',
                //         type: 'circle',
                //         paint: {
                //             "circle-color": "#806cf9",
                //             "circle-opacity": 1,
                //         }
                //     });
                // }

                // map.addSource("selectedGeom", {
                //     type: "geojson",
                //     data: feature.toJSON(),
                // });
                // map.addLayer({
                //     id: "selectedGeom",
                //     type: "circle",
                //     source: "selectedGeom",
                //     paint: {
                //         "circle-radius": [
                //             "interpolate",
                //             ["linear"],
                //             ["get", "evictions"],
                //             0,
                //             2,
                //             400,
                //             35,
                //         ],
                //         "circle-color": "#4223FF",
                //         "circle-opacity": 0.8,
                //     },
                // });


            });

            pointerEvents("id");

            map.setFog({
                range: [9, 20],
                color: "#f0a800",
                "high-color": "#d63088",
                "horizon-blend": 0.02, // default: .1
                "space-color": "#000000",
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
    class={selected !== undefined && mobile ? "non-interactive" : null}
>
    {#if map}
        <RippleLoader />
    {/if}
</div>

<style>
    .non-interactive {
        pointer-events: none;
    }
</style>
