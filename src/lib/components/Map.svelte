<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import mapbox from "mapbox-gl";
    import { goto } from "$app/navigation";
    import { primary, success } from "$lib/styles/_variables";
    import { PUBLIC_MAPBOX_TOKEN } from "$env/static/public";
    import { appState } from "$lib/state.svelte.ts";

    import type { LngLatLike, LngLatBoundsLike, MapMouseEvent } from "mapbox-gl";
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
                url: "mapbox://mit-spatial-action.who-owns-mass-sites"
            });

            appState.map.addLayer({
                id: "sites",
                source: "sites",
                "source-layer": "geographies",
                type: "circle",
                paint: {
                    "circle-pitch-alignment": "map",
                    "circle-radius": [
                        "case",
                        ["boolean", ["feature-state", "selected"], false],
                        30,
                        8
                    ],
                    "circle-color": [
                        'case',
                        ['boolean', ['feature-state', 'selected'], false],
                        primary,
                        success
                    ],
                    "circle-stroke-color": "white",
                    "circle-stroke-width": [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        2,
                        0.5
                    ],
                    "circle-opacity": 0.7,
                    "circle-emissive-strength": 1
                },
            });
            let selected;
            appState.map.addInteraction("sites-click", {
                type: "click",
                target: { layerId: "sites" },
                handler(e) {
                    if (selected) appState.map.removeFeatureState(selected);
                    selected = e.feature;
                    appState.map.setFeatureState(selected, {selected: true});
                    goto(`/site/${e.feature.properties.site_id}`);
                },
            });

            appState.map.addInteraction("sites-mouseenter", {
                type: "mouseenter",
                target: { layerId: "sites" },
                handler(e) {
                    appState.map.setFeatureState(e.feature, {hover: true});
                    appState.map.getCanvas().style.cursor = "pointer";
                    // const feature = e.feature;
                    // popup = new mapbox.Popup({ 
                    //         offset: [0, -15],
                    //         className: 'sites-popup'
                    //     })
                    //     .setLngLat(feature.geometry.coordinates)
                    //     .setHTML(
                    //         `<p><strong>${feature.properties.addr}</strong></p>
                    //         <p>${feature.properties.muni}, MA</p>`
                    //     )
                    //     .addTo(appState.map);
                },
            });

            appState.map.addInteraction("sites-mouseleave", {
                type: "mouseleave",
                target: { layerId: "sites" },
                handler(e) {
                    appState.map.setFeatureState(e.feature, {hover: false});
                    appState.map.getCanvas().style.cursor = "";
                    // popup.remove();
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

<div class="column" bind:this={container}></div>

<style>
    div {
        height: 100%;
        width: 100%;
    }
</style>
