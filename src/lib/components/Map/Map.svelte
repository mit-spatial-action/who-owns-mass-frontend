<script>
    import { onDestroy, onMount } from "svelte";
    import { siteNav, mapbox } from "$lib/scripts/utils";
   
    import bbox from "@turf/bbox";
    /* Helper functions */  
    // import { drawNetwork, drawNetworkPoints }  from "$lib/components/Map/helper-functions/DrawNetwork.js";

    import site_data from "$lib/config/instance.json";
    import "mapbox-gl/dist/mapbox-gl.css";

    import Device from "svelte-device-info";
    import {
        site,
        mapLoad,
        metacorp,
        loadState,
        gcResult
    } from "$lib/scripts/stores.js";
    
    import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';

    let mobile;

    mapbox.accessToken = PUBLIC_MAPBOX_TOKEN;

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

    let map;
    let selected;

    const flyToLngLat = (lngLat, zoom = resultZoom) => {
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
    loadState.set(true);
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
            loadState.set(false);
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
