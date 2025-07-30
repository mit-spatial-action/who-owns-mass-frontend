<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import mapbox from "mapbox-gl";
    import { goto } from "$app/navigation";
    import { primary } from "$lib/styles/_variables";
    import { PUBLIC_MAPBOX_TOKEN } from "$env/static/public";
    import { appState } from "$lib/state.svelte.ts";

    import type { LngLatLike, LngLatBoundsLike } from "mapbox-gl";
    import mapConfig from "$lib/config/map.json";
    import "mapbox-gl/dist/mapbox-gl.css";

    let initLngLat = new mapbox.LngLat(
        mapConfig.init.lngLat[0],
        mapConfig.init.lngLat[1],
    )

    mapbox.accessToken = PUBLIC_MAPBOX_TOKEN;

    let container;
    let popup;

    const nightLight = (dark: Boolean) => {
        return dark ? "night" : "day";
    };

    

    

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
            zoom: mapConfig.init.zoomFrom ? mapConfig.init.zoomFrom : mapConfig.init.zoom,
            bearing: mapConfig.init.bearing,
            pitch: mapConfig.init.pitch,
            projection: mapConfig.projection,
            maxBounds: mapConfig.maxBounds as LngLatBoundsLike,
            maxZoom: mapConfig.resultZoom,
        });

        appState.map.once("idle", () => {
            appState.loading = false;
            appState.map.setMinZoom(mapConfig.init.zoom);
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
                        mapConfig.resultZoom - 4,
                        0,
                        mapConfig.resultZoom,
                        8,
                    ],
                    "circle-color": primary,
                    "circle-stroke-color": "white",
                    "circle-stroke-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        mapConfig.resultZoom - 4,
                        0,
                        mapConfig.resultZoom,
                        1.5,
                    ],
                    "circle-opacity": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        mapConfig.resultZoom - 4,
                        0,
                        mapConfig.resultZoom,
                        0.7,
                    ],
                    "circle-emissive-strength": 1
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

            if (mapConfig.init.zoomFrom) {
                appState.map.flyTo({
                    center: initLngLat,
                    zoom: mapConfig.init.zoom,
                    duration: mapConfig.init.zoomDur,
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

<div id="map" class="column" bind:this={container}></div>

<style>
    #map {
        height: 100%;
        width: 100%;
    }
</style>
