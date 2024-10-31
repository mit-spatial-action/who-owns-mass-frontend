<script>
    import { onDestroy, onMount, setContext } from "svelte";
    import { page } from "$app/stores";
    //import Turf from '@turf/turf';
    //import ForwardGeocoder from '$lib/components/Map/Geocoders/.svelte';
    import SearchGeocoder from "$lib/components/Map/Geocoders/SearchCombined.svelte";
    //import ReverseGeocoder from '$lib/components/Map/Geocoders/Reverse.svelte';
    import SelectedGeometry from "$lib/components/Map/SelectedGeometry.svelte";
    import RippleLoader from "$lib/components/RippleLoader.svelte";
   
    /* Helper functions */  
   import { drawNetwork, drawNetworkPoints }  from "$lib/components/Map/helper-functions/DrawNetwork.js";

    import site_data from "$lib/config/instance.json";
 

    import "mapbox-gl/dist/mapbox-gl.css";

    import { mapbox } from "$lib/scripts/utils";
    // import Evictions from '$lib/config/SampleEvictions.geojson';

    import Device from "svelte-device-info";
    import {
        remountSearchbar,
        selectedFeature,
        getMap,
        getCompany,
        getMetaCorp,
        company_id,
        company,
        metacorp
    } from "$lib/scripts/stores.js";

    let mobile;

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

    export let resultZoom = 10;
    export let resultFlySpeed = 2000;

    let container;
    let map;
    let lngLat;
    let gcResult;
    let selected;

    let loadingState = true;

    const unsubscribeMap = getMap.subscribe((retrieveMap) => {
        // Callback can be used to get map, if needed.
    });

    //Get remount searchbar value from store
    let remountSearchbar_value;
    const unsubscribe = remountSearchbar.subscribe((value) => {
        remountSearchbar_value = value;
    });

    const unsubscribe2 = selectedFeature.subscribe((value) => {
    });

    const unsubscribe_get_new_company = company_id.subscribe(value => {
        if (value && typeof(value) != "object") {
            let company_id_to_query = parseInt(value);
            setTimeout(goToFeature(map, company_id_to_query), 2000);
        }
    });

    function goToFeature(map, company_id_to_query) {
        // getting feature from tileset and flying to it
        // if it's got a different address
        let features = map.querySourceFeatures('companies_updated', {
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
    function flyToLngLat(lngLat) {
        map.flyTo({
            center: lngLat,
            zoom: map.getZoom() > resultZoom ? map.getZoom() : resultZoom,
            duration: resultFlySpeed,
            essential: true,
        });
    }

    $: lngLat ? flyToLngLat(lngLat) : null;

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
        };
        map = new mapbox.Map(mapOptions);

        map.on("load", async () => {

            map.addSource("companies_updated", {
                type: "vector",
                url: "mapbox://mit-spatial-action.companies_updated",
            });

            map.addLayer({
                id: "id",
                source: "companies_updated",
                "source-layer": "geographies",
                type: "circle",
                paint: {
                    "circle-radius": [
                        "interpolate",
                        ["linear"],
                        ["get", "units"],
                        0,
                        0,
                        400,
                        30,
                    ],
                    "circle-color": "#FF5F05",
                    "circle-opacity": 0.7,
                },
            });
            handleUrlChange();
        });
        map.once("zoomend", () => {
            loadingState = !loadingState;
            map.setMinZoom(initZoom.length === 2 ? initZoom[1] : initZoom);
        });
        map.on("style.load", () => {
            //TODO: create shared functions to 1) clear selected geometries and 2) handle url change. Maybe call when change to selectedFeature?
            map.on("click", async (e) => {
                lngLat = e.lngLat;
                // can add getting address here (if we don't want to store it in mapbox or in the DB:
                // https://stackoverflow.com/questions/70223500/mapbox-gl-js-find-closest-address-to-clicked-point)
                if (typeof map.getLayer("selectedGeom") !== "undefined") {
                    map.removeLayer("selectedGeom");
                    map.removeSource("selectedGeom");

                    map.removeLayer("affiliates");
                    map.removeSource("affiliates");

                    map.removeLayer("network");
                    map.removeSource("routes");
                }

                var features = map.queryRenderedFeatures(e.point, {
                    layers: ["id"],
                });
                console.log("getting features on 181", features);
                if (!features.length) {
                    selectedFeature.set([]);
                    updateLocationURL({});
                    return;
                }

                var feature = features[0];
                var network = drawNetwork(feature.geometry.coordinates);
                var networkPoints = drawNetworkPoints();
                await $getMetaCorp(feature.properties.network_group);
                // if (feature.properties.company_id) {
                //     console.log("COMPANY ID"); 
                //     console.log(feature.properties.company_id);
                    
                //     await $getCompany(feature.properties.company_id);
                // }
                // else {
                // }

                selectedFeature.set([feature]);
                updateLocationURL(feature.properties.network_group);

            // Add network, if 1+ affiliated companies
                if(network.features.length > 0){

                    map.addSource('routes', {
                        'type': 'geojson',
                        'data': network
                    });

                    map.addSource('affiliates', {
                        'type': 'geojson',
                        'data': networkPoints
                    });

                    map.addLayer({
                        id: "network",
                        source: 'routes',
                        type: 'line',
                        paint: {
                            'line-width': 1.5,
                            'line-color': '#806cf9',
                            'line-opacity': 0.8
                        }
                    });

                    map.addLayer({
                        id: "affiliates",
                        source: 'affiliates',
                        type: 'circle',
                        paint: {
                            "circle-color": "#806cf9",
                            "circle-opacity": 1,
                        }
                    });
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
                        "circle-opacity": 0.8,
                    },
                });


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
        unsubscribe2();
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
                // layers: ["companies_updated"],
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
        <RippleLoader bind:loadingState />
        <!-- <ReverseGeocoder bind:lngLat bind:gcResult />-->
        {#key remountSearchbar_value}
            <SearchGeocoder bind:lngLat bind:gcResult bind:selected />
        {/key}
        <SelectedGeometry bind:selected bind:lngLat bind:loadingState />
    {/if}
</div>

<style>
    .non-interactive {
        pointer-events: none;
    }
</style>
