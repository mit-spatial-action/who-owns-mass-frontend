<script>
    import { onDestroy, onMount, setContext } from "svelte";
    import RippleLoader from "$lib/components/RippleLoader.svelte";
    import { goto, invalidate } from '$app/navigation';
    import { siteNav } from "$lib/scripts/utils";
   
    import bbox from "@turf/bbox";
    /* Helper functions */  
    import { drawNetwork, drawNetworkPoints }  from "$lib/components/Map/helper-functions/DrawNetwork.js";

    import site_data from "$lib/config/instance.json";
 

    import "mapbox-gl/dist/mapbox-gl.css";

    import { mapbox } from "$lib/scripts/utils";

    import Device from "svelte-device-info";
    import {
        site,
        getMap,
        mapLoad,
        metacorp,
        loadState,
        gcResult
    } from "$lib/scripts/stores.js";

    let mobile;
    // onMount(() => {
    //     loadState.set(true);
    // });

    export let mapbox_token;

    mapbox.accessToken = mapbox_token;

    export let style = "mapbox://styles/mit-spatial-action/cluwwvx8l00gi01pe8mi4e64o";

    export let projection = "globe";
    export let initLngLat = site_data.map.init.lngLat;
    initLngLat = new mapbox.LngLat(initLngLat[0], initLngLat[1]);
    export let initZoom = site_data.map.init.zoom;
    export let initZoomDur = 500; //change back to 3000 after dev

    export let maxBounds = [
        [-179, 19],
        [-67, 72],
    ];

    export let resultZoom = 18;

    let map;
    let lngLat;
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

    const renderMetaCorp = (mc_sites) => {
        if(mc_sites && map){
            if(Object.keys(mc_sites).length > 1) {
                if (typeof map.getLayer("selectedMetaCorpLayer") !== "undefined") {
                    map.removeLayer("selectedMetaCorpLayer");
                    map.removeSource("selectedMetaCorp");
                }
                map.addSource('selectedMetaCorp', {
                    'type': 'geojson',
                    'data': mc_sites
                });
                map.addLayer({
                    id: "selectedMetaCorpLayer",
                    source: 'selectedMetaCorp',
                    type: 'circle',
                    paint: {
                        "circle-radius": 10,
                        "circle-color": "blue",
                        "circle-opacity": 1
                    }
                });

                let jsonBbox = bbox(mc_sites);
                map.fitBounds(jsonBbox, {
                    padding: 50
                });
            }
        }
    }

    const renderSite = (site) => {
        if(site && map ){
            if(Object.keys(site).length > 0) {
                if (typeof map.getLayer("selectedSiteLayer") !== "undefined") {
                    map.removeLayer("selectedSiteLayer");
                    map.removeSource("selectedSite");
                }
                map.addSource('selectedSite', {
                    'type': 'geojson',
                    'data': site
                });
                map.addLayer({
                    id: "selectedSiteLayer",
                    source: 'selectedSite',
                    type: 'circle',
                    paint: {
                        "circle-radius": 10,
                        "circle-color": "blue",
                        "circle-opacity": 1
                    }
                });
            }
        }
    }
    
    $: flyToQuery($gcResult);
    $: renderMetaCorp($metacorp.sites); 
    $: renderSite($site);

    onMount(() => {
        mobile = Device.isPhone;
        let mapOptions = {
            container: "map",
            style: "mapbox://styles/mapbox/light-v11",
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
                // var network = drawNetwork(feature.geometry.coordinates);
                // var networkPoints = drawNetworkPoints();
                await goto(
                    `/site/${feature.properties.site_id}`
                );
                await invalidate('site');

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

            map.on('mouseenter', 'id', () => {
                map.getCanvas().style.cursor = 'pointer';
            });

            // Change it back to a pointer when it leaves.
            map.on('mouseleave', 'id', () => {
                map.getCanvas().style.cursor = '';
            });

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

        getMap.set(() => map);
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
