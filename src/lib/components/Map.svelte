<script lang="ts">
    import { navigating } from "$app/state";
    import { onDestroy, onMount } from "svelte";
    import mapbox from "mapbox-gl";
    import { goto } from "$app/navigation";
    import type { FeatureCollection, Feature } from "geojson";
    import { primary } from "$lib/styles/_variables";
    import { PUBLIC_MAPBOX_TOKEN } from "$env/static/public";
    import { appState } from "$lib/state.svelte.ts";

    import bbox from "@turf/bbox";
    import type { LngLat, LngLatBoundsLike, Map } from "mapbox-gl";
    import mapConfig from "$lib/config/map.json";
    import "mapbox-gl/dist/mapbox-gl.css";

    import SpinnerModal from "$lib/components/SpinnerModal.svelte";

    let intervals = {
        circles: [],
        markers: [],
    };

    let {
        projection = mapConfig.projection,
        initLngLat = new mapbox.LngLat(
            mapConfig.init.lngLat[0],
            mapConfig.init.lngLat[1],
        ),
        maxBounds = new mapbox.LngLatBounds(mapConfig.maxBounds),
        initZoom = mapConfig.init.zoom,
        initZoomDur = mapConfig.init.zoomDur,
        resultZoom = mapConfig.resultZoom,
    }: {
        projection?: any;
        initLngLat?: any;
        maxBounds?: LngLatBoundsLike;
        initZoom?: any;
        initZoomDur?: any;
        resultZoom?: any;
    } = $props();

    let loaded = $state(false);
    mapbox.accessToken = PUBLIC_MAPBOX_TOKEN;

    let container;
    let popup;

    const nightLight = (dark: Boolean) => {
        return dark ? "night" : "day";
    };

    // const clearLayers = async (map:Map, layerIds:string[]) => {
    //     if (!map) return undefined;
    //     layerIds.forEach((layerId) => {
    //         if (typeof map.getLayer(layerId) !== "undefined") {
    //             map.removeLayer(layerId);
    //         }
    //         if (typeof map.getSource(layerId) !== "undefined") {
    //             map.removeSource(layerId);
    //         }
    //     })

    //     map.flyTo({ pitch: 30, bearing: -50 })
    // }

    // const getLabelLayerId = (map:Map) => {
    //     if (!map) return undefined;
    //     const layers = map.getStyle().layers;
    //     return layers.find(
    //         (layer) => layer.type === 'symbol' && layer.layout['text-field']
    //     ).id;
    // }

    // const getPaintOrLayout = (map:Map, layerId:string, property:string) => {
    //     const layer = map.getLayer(layerId);
    //     if (property in layer.paint) {
    //         return "paint"
    //     } else if (property in layer.layout) {
    //         return "layout"
    //     } else {
    //         undefined
    //     }
    // }

    // const animateProperty = (
    //     map:Map,
    //     layerId:string,
    //     property:string,
    //     end:number | number[],
    //     duration:number,
    //     bounce:boolean = false,
    //     delay:number = 40) => {
    //     if (!map) return undefined;
    //     let start;
    //     let delta;
    //     let step;
    //     let progress;

    //     let type = getPaintOrLayout(map, layerId, property)
    //     if (type === "paint") {
    //         start = map.getPaintProperty(layerId, property)
    //     } else if (type === "layout") {
    //         start = map.getLayoutProperty(layerId, property)
    //     }

    //     let val = start;
    //     if (Array.isArray(end)) {
    //         delta = end.map((a, i) => a - start[i]);
    //         step = delta.map((a) => a * (delay / duration));
    //         progress = [0, 0];
    //     } else {
    //         delta = (end - start);
    //         step = delta * (delay / duration);
    //         progress = 0;
    //     }

    //     return setInterval(() => {
    //         if (type === "paint") {
    //             map.setPaintProperty(layerId, property, val);
    //         } else if (type === "layout") {
    //             map.setLayoutProperty(layerId, property, val);
    //         }
    //         if (Array.isArray(end)) {
    //             val = val.map((a, i) => a + step[i])
    //             progress = progress.map((a, i) => a + step[i]);
    //         } else {
    //             val += step
    //             progress += step
    //         }
    //         if (!bounce && Math.abs(progress) >= Math.abs(delta)) {
    //             val = start;
    //             if (Array.isArray(end)) {
    //                 progress = [0, 0]
    //             } else {
    //                 progress = 0;
    //             }
    //         }
    //         if (bounce && Math.abs(progress) >= Math.abs(delta)) {
    //             if (Array.isArray(end)) {
    //                 step = step.map((a) => -a)
    //                 progress = [0, 0];
    //             } else {
    //                 step = -step;
    //                 progress = 0;
    //             }
    //         }
    //     },
    //     delay
    //     )
    // }

    // const animateCircles = (
    //     map:Map,
    //     layerId:string) => {
    //     if (!map) return undefined;
    //     intervals.circles.push(animateProperty(map, layerId, 'circle-radius', 20, 1000))
    //     intervals.circles.push(animateProperty(map, layerId, 'circle-opacity', 0, 1000))
    // }

    // const animateMarkers = (map:Map, layerId):string => {
    //     if (!map) return undefined;
    //     intervals.markers.push(animateProperty(map, layerId, 'text-offset', [0, -0.35], 1000))
    // }

    // const clearIntervals = (intervalArray: NodeJS.Timeout[]) => {
    //     intervalArray.forEach((interval) => {
    //         clearInterval(interval);
    //     })
    // }

    // const addCircles = async (
    //     map:Map,
    //     geojson:FeatureCollection|Feature,
    //     layerId:string,
    //     color:string) => {
    //     await clearLayers(map, [layerId])
    //     // clearIntervals(intervals.circles);
    //     map.addLayer({
    //         id: layerId,
    //         source: {
    //             type: 'geojson',
    //             data: geojson
    //         },
    //         type: 'circle',
    //         paint: {
    //             "circle-radius": 0,
    //             "circle-pitch-alignment": "map",
    //             "circle-color": color,
    //             "circle-opacity": 1
    //         }
    //     });
    //     // animateCircles(map, layerId);
    //     // pointerEvents(map, layerId, true);
    // }

    // const addMarkers = async (
    //     map:Map,
    //     geojson:FeatureCollection|Feature,
    //     layerId:string,
    //     color:string) => {
    //     await clearLayers(map, [layerId])
    //     // clearIntervals(intervals.markers);
    //     map.addLayer({
    //         id: layerId,
    //         source: {
    //             type: 'geojson',
    //             data: geojson
    //         },
    //         type: 'symbol',
    //         layout: {
    //             'text-field': '\u25BC',
    //             'text-size': 64,
    //             'text-offset': [0, -0.25],
    //             'text-anchor': "center",
    //             'text-allow-overlap': true,
    //             'text-ignore-placement': true
    //         },
    //         paint: {
    //             'text-halo-color': 'white',
    //             'text-halo-width': 1.5,
    //             'text-color': color,
    //             'text-halo-blur': 1
    //         }
    //     });
    //     // animateMarkers(map, layerId);
    //     // pointerEvents(map, layerId, true);
    // }

    // const renderGeoJSONLayer = async (
    //     map:Map,
    //     geojson:FeatureCollection|Feature) => {
    //     if (!map) return undefined;
    //     if(Object.keys(geojson).length > 1) {
    //         await addCircles(map, geojson, "selectedCircles", primary);
    //         await addMarkers(map, geojson, "selectedMarkers", primary);
    //         let jsonBbox = bbox(geojson);
    //         map.fitBounds(jsonBbox, {
    //             padding: 50,
    //             pitch: 45,
    //             bearing: -45,
    //             animate: true,
    //             duration: initZoomDur
    //         });
    //     };
    // }

    // Function to toggle the layer visibility
    // const toggleLayerVisibility = (
    //     map:Map,
    //     layerId: string,
    //     condition:boolean) => {
    //     if (!map) return undefined;
    //     if (!condition) {
    //         // Set the visibility to 'none' to hide the layer
    //         map.setLayoutProperty(layerId, 'visibility', 'none');
    //     } else {
    //         // Set the visibility to 'visible' to show the layer
    //         map.setLayoutProperty(layerId, 'visibility', 'visible');
    //     }
    // }

    // const highlightHovered = (
    //     map:Map,
    //     highlighted:string|number,
    //     layerId:string) => {
    //     if (!map) return undefined;
    //     if (!highlighted) {
    //         map.setPaintProperty(layerId, 'text-opacity', 1)
    //     } else {
    //         map.setPaintProperty(
    //             layerId,
    //             'text-opacity',
    //             [
    //                 'case',
    //                 ['==', ['id'], highlighted], 1,
    //                 0.4
    //             ]
    //         )
    //     }
    // }

    onMount(() => {
        appState.map = new mapbox.Map({
            container: container,
            style: mapConfig.style,
            center: initLngLat,
            zoom: initZoom.length === 2 ? initZoom[0] : initZoom,
            bearing: mapConfig.init.bearing,
            pitch: mapConfig.init.pitch,
            projection: projection,
            maxBounds: maxBounds,
            maxZoom: resultZoom,
        });

        appState.map.once("idle", () => {
            loaded = true;
            // map.setMinZoom(initZoom.length === 2 ? initZoom[1] : initZoom);
        });

        appState.map.on("style.load", () => {
            let isDark = window.matchMedia("(prefers-color-scheme: dark)");

            appState.map.setConfigProperty(
                "basemap",
                "lightPreset",
                nightLight(isDark.matches),
            );
            isDark.addEventListener("change", (e) => {
                appState.map.setConfigProperty(
                    "basemap",
                    "lightPreset",
                    nightLight(e.matches),
                );
            });
           appState.map.addSource("sites", {
                type: "vector",
                url: "mapbox://mit-spatial-action.who-owns-mass-sites",
            });

            appState.map.addLayer({
                id: "sites",
                source: "sites",
                // maxzoom: resultZoom,
                "source-layer": "geographies",
                type: "circle",
                paint: {
                    "circle-pitch-alignment": "map",
                    "circle-radius": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        resultZoom - 4,
                        0,
                        resultZoom,
                        8,
                    ],
                    "circle-color": primary,
                    "circle-stroke-color": "white",
                    "circle-stroke-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        resultZoom - 4,
                        0,
                        resultZoom,
                        1.5,
                    ],
                    "circle-opacity": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        resultZoom - 4,
                        0,
                        resultZoom,
                        0.7,
                    ],
                },
            });

            appState.map.addInteraction("sites-click", {
                type: "click",
                target: { layerId: "sites" },
                handler(e) {
                    goto(`/site/${e.feature.properties.site_id}`);
                },
            });

            appState.map.addInteraction("sites-mouseenter", {
                type: "mouseenter",
                target: { layerId: "sites" },
                handler(e) {
                    const feature = e.feature;
                    popup = new mapbox.Popup({ 
                            offset: [0, -15],
                            className: 'sites-popup'
                        })
                        .setLngLat(feature.geometry.coordinates)
                        .setHTML(
                            `<p><strong>${feature.properties.addr}</strong></p>
                            <p>${feature.properties.muni}, MA</p>`
                        )
                        .addTo(appState.map);
                    appState.map.getCanvas().style.cursor = "pointer";
                },
            });

            appState.map.addInteraction("sites-mouseleave", {
                type: "mouseleave",
                target: { layerId: "sites" },
                handler() {
                    appState.map.getCanvas().style.cursor = "";
                    popup.remove();
                },
            });

            // pointerEvents(map, "sites", false, "site_id");

            if (initZoom.length === 2) {
                appState.map.flyTo({
                    center: initLngLat,
                    zoom: initZoom[1],
                    duration: initZoomDur,
                    essential: true,
                });
            }
        });
    });

    onDestroy(() => {
        if (appState.map) appState.map.remove();
        // if (intervals.circles) clearIntervals(intervals.circles);
    });
</script>

{#if navigating.from || !loaded}
    <SpinnerModal />
{/if}

<div id="map" class="column" bind:this={container}></div>

<style>
    #map {
        height: 100%;
        width: 100%;
    }
</style>
