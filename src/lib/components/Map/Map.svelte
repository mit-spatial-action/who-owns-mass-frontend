<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { siteNav, mapbox } from "$lib/scripts/utils";
    import type { FeatureCollection, Feature } from "geojson";
    import styles from '$lib/config/styles.json';
    // console.log($primary);
   
    import bbox from "@turf/bbox";
    /* Helper functions */  
    // import { drawNetwork, drawNetworkPoints }  from "$lib/components/Map/helper-functions/DrawNetwork.js";

    import mapConfig from "$lib/config/map.json";
    import "mapbox-gl/dist/mapbox-gl.css";

    import Device from "svelte-device-info";
    import {
        site,
        metacorp,
        loadState,
        homeState,
        gcResult,
        mapLoaded,
        highlighted
    } from "$lib/stores";

    export let mapbox_token: string;

    let mobile:boolean = false;

    mapbox.accessToken = mapbox_token;

    export let style = mapConfig.style;
    export let projection = mapConfig.projection;
    export let initLngLat = new mapbox.LngLat(
        mapConfig.init.lngLat[0],
        mapConfig.init.lngLat[1]
    );
    export let initZoom = mapConfig.init.zoom;
    export let initZoomDur = mapConfig.init.zoomDur; //change back to 3000 after dev
    export let maxBounds = mapConfig.maxBounds;
    export let resultZoom = mapConfig.resultZoom;

    let map: mapboxgl.Map;

    const flyToLngLat = (map, lngLat: mapboxgl.LngLat, zoom: number = resultZoom) => {
        if (!map) return undefined;
        map.flyTo({
            center: lngLat,
            zoom: map.getZoom() > zoom ? map.getZoom() : zoom,
            duration: initZoomDur,
            essential: true,
            bearing: -45,
            pitch: 45
        });
    }

    const flyToQuery = async (map, gcResult) => {
        if (!map) return undefined;
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
        flyToLngLat(map, gcResult.lngLat)
    }

    const pointerEvents = (map, layer) => {
        if (!map) return undefined;
        map.on('mouseenter', layer, () => {
                map.getCanvas().style.cursor = 'pointer';
            });

        map.on('mouseleave', layer, () => {
            map.getCanvas().style.cursor = '';
        });
    }

    const clearLayersSources = async (map, names, suffixes) => {
        if (!map) return undefined;
        suffixes.forEach((suffix) => {
            if (typeof map.getLayer(`selected${suffix}`) !== "undefined") {
                map.removeLayer(`selected${suffix}`);
            }
            if (typeof map.getSource(`selected${suffix}`) !== "undefined") {
                map.removeSource(`selected${suffix}`);
            }
        })
    }

    const getLabelLayerId = (map) => {
        if (!map) return undefined;
        const layers = map.getStyle().layers;
        return layers.find(
            (layer) => layer.type === 'symbol' && layer.layout['text-field']
        ).id;
    }

    let circleInterval;
    const animateCircles = (map, suffix="Circle") => {
        if (!map) return undefined;
        let radius = 1;
        let opacity = 1;
        const opacityStep = 0.05
        circleInterval = setInterval(() => {
            map.setPaintProperty(`selected${suffix}`, 'circle-radius', radius);
            radius = (radius + 1) % 20;
            map.setPaintProperty(`selected${suffix}`, 'circle-opacity', opacity);
            opacity -= opacityStep;

            if (opacity <= 0) {
                opacity = 1;
            }
        }, 40);
    }

    const renderGeoJSONLayer = async (map, geojson: FeatureCollection | Feature) => {
        if (!map) return undefined;
        await clearLayersSources(map, ["Site", "MetaCorp"], ["Marker", "Circle"])
        clearInterval(circleInterval);
        if(Object.keys(geojson).length > 1) {
            await map.addLayer({
                id: `selectedCircle`,
                source: {
                    type: 'geojson',
                    data: geojson
                },
                type: 'circle',
                paint: {
                    "circle-radius": 3,
                    "circle-pitch-alignment": "map",
                    "circle-color": styles.primary,
                    "circle-opacity": 1
                }
            });

            animateCircles(map);
            
            pointerEvents(map, 'selectedCirle');

            await map.addLayer({
                id: `selectedMarker`,
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
                    'text-color': styles.primary,
                    'text-halo-blur': 1
                }
            });
            
            pointerEvents(map, 'selectedMarker');

            map.on('mouseenter', 'selectedCircle', (e) => {
                highlighted.set(e.features[0].id);
            })

            map.on('mouseleave', 'selectedCircle', () => {
                highlighted.set(null);
            })

            map.on('click', 'selectedCircle', async (e) => {
                await siteNav(e.features[0].id)
            })

            map.on('mouseenter', 'selectedMarker', (e) => {
                highlighted.set(e.features[0].id);
            })

            map.on('mouseleave', 'selectedMarker', () => {
                highlighted.set(null);
            })
            
            map.on('click', 'selectedMarker', async (e) => {
                await siteNav(e.features[0].id)
            })

            let jsonBbox = bbox(geojson);
            map.fitBounds(jsonBbox, {
                padding: 50,
                pitch: 45,
                bearing: -45,
                animate: true,
                duration: initZoomDur
            });
        };
    }

    // Function to toggle the layer visibility
    const toggleLayerVisibility = (map, condition, layerId) => {
        if (!map) return undefined;
        if (!condition) {
            // Set the visibility to 'none' to hide the layer
            map.setLayoutProperty(layerId, 'visibility', 'none');
        } else {
            // Set the visibility to 'visible' to show the layer
            map.setLayoutProperty(layerId, 'visibility', 'visible');
        }
    }

    const highlightHovered = (map, highlighted) => {
        if (!map) return undefined;
        if (!highlighted) {
            map.setPaintProperty(`selectedMarker`, 'text-opacity', 1)
        } else {
            map.setPaintProperty(
                `selectedMarker`,
                'text-opacity',
                [
                    'case',
                    ['==', ['id'], highlighted], 1,
                    0.4
                ]
            )
        }
    }
    
    loadState.set(true);
    $: $mapLoaded && Object.keys($gcResult).length > 1 ? flyToQuery(map, $gcResult) : null;
    $: $mapLoaded && Object.keys($metacorp).length > 1 ? renderGeoJSONLayer(map, $metacorp.sites) : null;
    $: $mapLoaded && Object.keys($site).length > 1 ? renderGeoJSONLayer(map, $site) : null;
    // $: console.log($highlighted)
    $: $mapLoaded ? highlightHovered(map, $highlighted) : null;
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
                    "circle-radius": [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        resultZoom - 4,
                        0,
                        // When zoom is 18 or higher, buildings will be 100% opaque.
                        resultZoom,
                        5
                    ],
                    "circle-color": styles.success,
                    "circle-opacity": [
                        'interpolate',
                        ['linear'],
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


        map.once("idle", () => {
            mapLoaded.set(true);
            loadState.set(false);
            // map.setMinZoom(initZoom.length === 2 ? initZoom[1] : initZoom);
        });

        map.on("style.load", () => {
            map.on("click", "sites", async (e) => {
                var feature = e.features[0];
                await siteNav(feature.properties.site_id)
            });

            const labelLayerId = getLabelLayerId(map);
            // map.addSource("hexes", {
            //     type: "vector",
            //     url: "mapbox://mit-spatial-action.who-owns-mass-hexes",
            // });

            // map.addLayer({
            //     id: "hexes",
            //     source: "hexes",
            //     maxZoom: resultZoom,
            //     "source-layer": "geographies",
            //     type: "fill-extrusion",
            //     filter: ['==', ['get', 'size'], 0.5],
            //     paint: {
            //         "fill-extrusion-height": [
            //             'interpolate',
            //             ['exponential', 1.5],
            //             ['get', 'prop_count_mean_ntile'],
            //             0, 0,
            //             5, 3000
            //         ],
            //         "fill-extrusion-color": [
            //             'interpolate',
            //             ['exponential', 1.5],
            //             ['get', 'prop_count_mean_ntile'],
            //             0, 'white',
            //             // When zoom is 18 or higher, buildings will be 100% opaque.
            //             5, "#3CAAA9"
            //         ],
            //         'fill-extrusion-opacity': 0.9
            //         // "circle-opacity": [
            //         //     'interpolate',
            //         //     ['exponential', 0.5],
            //         //     ['zoom'],
            //         //     resultZoom - 4,
            //         //     0,
            //         //     // When zoom is 18 or higher, buildings will be 100% opaque.
            //         //     resultZoom,
            //         //     1
            //         // ],
            //     },
            // },
            // labelLayerId);

            // map.on('zoom', function() {
            //     const zoomLevel = map.getZoom();  // Get the current zoom level

            //     if (zoomLevel < 12 && $homeState) {
            //         // Show the layer when zoom level is greater than the threshold
            //         map.setLayoutProperty('hexes', 'visibility', 'visible');
            //     } else {
            //         // Hide the layer when zoom level is less than or equal to the threshold
            //         map.setLayoutProperty('hexes', 'visibility', 'none');
            //     }
            // });

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

            pointerEvents(map, "sites");

            map.setFog({
                range: [0.25, 2],
                color: "#fff",
                "high-color": "#fff",
                "horizon-blend": 0.1, // default: .1
                "space-color": styles.success,
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
        if (map) map.remove();
        if (circleInterval) clearInterval(circleInterval);
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