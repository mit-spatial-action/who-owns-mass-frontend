<script>
    import { onDestroy, onMount, setContext } from "svelte";
    import { page } from "$app/stores";
    import ForwardGeocoder from "$lib/components/Map/Geocoders/ForwardGeocoder.svelte";
    import SelectedGeometry from "$lib/components/Map/SelectedGeometry.svelte";
    import RippleLoader from "$lib/components/RippleLoader.svelte";
   
    import bbox from "@turf/bbox";
    /* Helper functions */  
    import { drawNetwork, drawNetworkPoints }  from "$lib/components/Map/helper-functions/DrawNetwork.js";

    import site_data from "$lib/config/instance.json";
 

    import "mapbox-gl/dist/mapbox-gl.css";

    import { mapbox } from "$lib/scripts/utils";

    import Device from "svelte-device-info";
    import {
        remountSearchbar,
        selectedFeature,
        site,
        getMap,
        getSite,
        company_id,
        infoMode,
        metacorp,
        loadState
    } from "$lib/scripts/stores.js";

    let mobile;
    onMount(() => {
        loadState.set(true);
    });

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
    export let resultFlySpeed = 2000;

    let container;
    let map;
    let lngLat;
    let gcResult;
    let selected;

    const unsubscribeMap = getMap.subscribe((retrieveMap) => {
        // Callback can be used to get map, if needed.
    });

    //Get remount searchbar value from store
    let remountSearchbar_value;
    const unsubscribe = remountSearchbar.subscribe((value) => {
        remountSearchbar_value = value;
    });

    // const unsubscribe2 = selectedFeature.subscribe((value) => {
    // });

    const unsubscribe_get_new_company = company_id.subscribe(value => {
        if (value && typeof(value) != "object") {
            let company_id_to_query = parseInt(value);
            setTimeout(goToFeature(map, company_id_to_query), 2000);
        }
    });

    function goToFeature(map, company_id_to_query) {
        // getting feature from tileset and flying to it
        // if it's got a different address
        let features = map.querySourceFeatures('parcelPoints', {
                sourceLayer: 'geographies',
                filter: ['==', 'company_id', company_id_to_query]
            });
            if (features.length > 0) {
                let feature = features[0];
                let coordinates = feature.geometry.coordinates;
                map.flyTo({ 
                    center: coordinates,
                    zoom: 15,
                    speed: 1.2,
                    curve: 1, 
                    easing(t) {
                        return t;
                    }
                });
            }
    }
    function flyToLngLat(lngLat, zoom = resultZoom) {
        map.flyTo({
            center: lngLat,
            zoom: map.getZoom() > zoom ? map.getZoom() : zoom,
            duration: 0,
            essential: true,
        });
    }

    async function flyToQuery() {
        let resultSiteId;
        loadState.set(true);
        map.once('idle', async (e) => {
            let features = map.queryRenderedFeatures({
                layers: ["id"],
            });
            console.log(features);
            if (features.length > 0) {
                let selected = features.filter(feature => feature.properties.addr.toUpperCase() === gcResult.address.toUpperCase())
                if (selected.length > 0) {
                    resultSiteId = await $getSite(selected[0].properties.site_id);
                } else {
                    resultSiteId = null;
                }
                resultSiteId = null;
            }
            loadState.set(false);
            gcResult = null;
            return resultSiteId
        })
        flyToLngLat(gcResult.lngLat)
    }

    function renderMetaCorp(mc_sites={}) {
        if(Object.keys(mc_sites).length > 1){
            infoMode.set("metaCorp")
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
                    "circle-color": "#FF5F05",
                    "circle-opacity": 1
                }
            });

            let jsonBbox = bbox(mc_sites);
            map.fitBounds(jsonBbox, {
                padding: 50
            });
        }
    }

    function renderSite(site={}) {
        if(Object.keys(site).length > 0){
            infoMode.set("site")
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
                    "circle-color": "#FF5F05",
                    "circle-opacity": 1
                }
            });
        }
    }

    $: lngLat ? flyToLngLat(lngLat) : null;
    $: gcResult ? flyToQuery(gcResult): null;
    $: renderMetaCorp($metacorp.sites); 
    $: renderSite($site);

    onMount(() => {
        mobile = Device.isPhone;
        let mapOptions = {
            container: container,
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
            handleUrlChange();
        });

        map.once("zoomend", () => {
            loadState.set(!loadState);
            map.setMinZoom(initZoom.length === 2 ? initZoom[1] : initZoom);
        });

        map.on("style.load", () => {
            //TODO: create shared functions to 1) clear selected geometries and 2) handle url change. Maybe call when change to selectedFeature?
            map.on("click", "id", async (e) => {
                // lngLat = e.lngLat;
                // can add getting address here (if we don't want to store it in mapbox or in the DB:
                // https://stackoverflow.com/questions/70223500/mapbox-gl-js-find-closest-address-to-clicked-point)

                var feature = e.features[0];
                // var network = drawNetwork(feature.geometry.coordinates);
                // var networkPoints = drawNetworkPoints();

                await $getSite(feature.properties.site_id);

                selectedFeature.set([feature]);
                updateLocationURL(feature.properties.site_id);

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

        // Add listener for URL query props
        window.addEventListener("popstate", handleUrlChange);
    });

    onDestroy(() => {
        if (map) {
            map.remove();
        }
        unsubscribe(); // Unsubscribes from the remountSearchBar dummy
        // unsubscribe2();
        unsubscribeMap();
        unsubscribe_get_new_company();
    });

    // Function to update the URL when a location is selected
    function updateLocationURL(feature) {
        // if (Object.keys(feature).length == 0) {
        //     const newUrl = `/`;
        //     window.history.pushState({}, "", newUrl);
        //     return;
        // }
        const newUrl = `/?location=${encodeURIComponent(feature)}`;
        window.history.pushState({ feature }, "", newUrl);
    }

    //  Example function for handling changes in the URL on Map
    function handleUrlChange() {
        const urlParams = $page.url.searchParams.get("location");
        var selectedLocations = [];
        if (urlParams) {
            selectedLocations = map.queryRenderedFeatures({
                // layers: ["companies_103120241149"],
                filter: ["==", "company_id", parseInt(urlParams)],
            });
        }
        // console.log("map.getLayer('selectedGeom')", map.getLayer("selectedGeom"))
        console.log("in handleUrlChange", selectedLocations);
        if (!selectedLocations.length) {
            selectedFeature.set([]);

            //Remove selected geometry layer - clean this process up/modularize?
            if (typeof map.getLayer("selectedGeom") !== "undefined") {
                map.removeLayer("selectedGeom");
                map.removeSource("selectedGeom");
            }
            return;
        } else {
            var feature = selectedLocations[0];
            selectedFeature.set([feature]);

            if (typeof map.getLayer("selectedGeom") !== "undefined") {
                map.removeLayer("selectedGeom");
                map.removeSource("selectedGeom");
            }

            map.addSource("selectedGeom", {
                type: "geojson",
                data: feature.toJSON(),
            });

            map.addLayer({
                id: "selectedGeom",
                type: "circle",
                source: "selectedGeom",
                paint: {
                    "circle-radius": [
                        "interpolate",
                        ["linear"],
                        ["get", "evictions"],
                        0,
                        2,
                        400,
                        35,
                    ],
                    "circle-color": "#4223FF",
                    "circle-opacity": 0.2,
                },
            });

            return;
        }
    }
</script>

<div
    id="map"
    class={selected !== undefined && mobile ? "non-interactive" : null}
    bind:this={container}
>
    {#if map}
        <RippleLoader />
        <!-- <ReverseGeocoder bind:lngLat bind:gcResult />-->
        {#key remountSearchbar_value}
            <ForwardGeocoder bind:gcResult />
        {/key}
        <!-- <SelectedGeometry bind:selected bind:lngLat /> -->
    {/if}
</div>

<style>
    .non-interactive {
        pointer-events: none;
    }
</style>
