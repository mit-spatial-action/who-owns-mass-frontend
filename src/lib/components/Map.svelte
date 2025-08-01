<script lang="ts">
    import { mount, onDestroy, onMount } from "svelte";
    import mapbox from "mapbox-gl";
    import { goto } from "$app/navigation";
    import { primary, success } from "$lib/styles/_variables";
    import { PUBLIC_MAPBOX_TOKEN } from "$env/static/public";
    import { appState } from "$lib/state.svelte.ts";

    import type { LngLatLike, LngLatBoundsLike, MapMouseEvent, Map } from "mapbox-gl";
    import mapConfig from "$lib/config/map.json";
    import MapHover from "$lib/components/MapHover.svelte";
    import "mapbox-gl/dist/mapbox-gl.css";

    let initLngLat = new mapbox.LngLat(
        mapConfig.init.lngLat[0],
        mapConfig.init.lngLat[1],
    )

    mapbox.accessToken = PUBLIC_MAPBOX_TOKEN;

    class HoverControl {
        address?: string;
        muni?: string;
        private _map?: any;
        private _container?: HTMLElement;

        constructor(address = null, muni = null) {
            this.address = address; 
            this.muni = muni;
        }
        onAdd(map: Map) {
            this._map = map;
            this._container = document.createElement('div');
            mount(MapHover, {
                target: this._container,
                props: {
                    address: this.address,
                    muni: this.muni
                }
            });
            return this._container;
        }

        onRemove() {
            this._container.parentNode.removeChild(this._container);
            this._map = undefined;
        }
    }

    let container;

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

        const nav = new mapbox.NavigationControl({
            visualizePitch: true
        });
        appState.map.addControl(nav, 'bottom-right');

        let hoverControls= [];

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
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        mapConfig.resultZoom - 4,
                        0,
                        mapConfig.resultZoom,
                        8
                    ],
                    "circle-color": success,
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
                    appState.map.getCanvas().style.cursor = "pointer";
                    if (hoverControls.length > 0) { 
                        hoverControls.forEach(c => {
                            appState.map.setFeatureState(c.feature, {hover: false});
                            appState.map.removeControl(c.control)
                            hoverControls = [];
                        })
                    };
                    appState.map.setFeatureState(e.feature, {hover: true});
                    let hover = new HoverControl(
                        e.feature.properties.addr,
                        e.feature.properties.muni
                    );
                    appState.map.addControl(hover);
                    hoverControls.push({
                        feature: e.feature,
                        control: hover
                    });
                },
            });

            appState.map.addInteraction("sites-mouseleave", {
                type: "mouseleave",
                target: { layerId: "sites" },
                handler(e) {
                    appState.map.getCanvas().style.cursor = "";
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
    });
</script>

<div class="column" bind:this={container}></div>

<style>
    div {
        height: 100%;
        width: 100%;
    }
</style>
