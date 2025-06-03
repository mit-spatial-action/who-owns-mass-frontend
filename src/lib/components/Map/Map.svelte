<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { siteNav, mapbox } from "$lib/scripts/utils";
    import type { FeatureCollection, Feature } from "geojson";
    import styles from '$lib/config/styles.json';
    
    import bbox from "@turf/bbox";
    /* Helper functions */  
    // import { drawNetwork, drawNetworkPoints }  from "$lib/components/Map/helper-functions/DrawNetwork.js";
    import type { MapOptions, LngLat, LngLatBoundsLike, Map } from 'mapbox-gl';
    import mapConfig from "$lib/config/map.json";
    import "mapbox-gl/dist/mapbox-gl.css";

    import {
        site,
        metacorp,
        loadState,
        homeState,
        errorState,
        gcResult,
        mapLoaded,
        highlighted
    } from "$lib/stores";

    export let mapboxToken: string;
    mapbox.accessToken = mapboxToken;

    let intervals = {
        "circles": [],
        "markers": []
    };

    export let style = mapConfig.style;
    export let projection = mapConfig.projection;
    export let initLngLat = new mapbox.LngLat(
        mapConfig.init.lngLat[0],
        mapConfig.init.lngLat[1]
    );
    export let maxBounds:LngLatBoundsLike = new mapbox.LngLatBounds(mapConfig.maxBounds);
    export let initZoom = mapConfig.init.zoom;
    export let initZoomDur = mapConfig.init.zoomDur;
    export let resultZoom = mapConfig.resultZoom;

    let map:Map;

    const flyToLngLat = (map:Map, lngLat:LngLat, zoom:number = resultZoom) => {
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

    const flyToQuery = async (map:Map, gcResult) => {
        if (!map) return undefined;
        let resultSiteId: string | number;
        loadState.set(true);
        map.once('idle', async (e: Event) => {
            let features = map.queryRenderedFeatures({
                layers: ["sites"],
            });
            if (features.length > 0) {
                let selected = features.filter(
                    feature => feature.properties.addr.toUpperCase() === gcResult.address.toUpperCase())
                if (selected.length > 0) {
                    await siteNav(selected[0].properties.site_id);
                } else {
                    errorState.set("addressNotFound");
                    resultSiteId = null;
                }
            }
            loadState.set(false);
            return resultSiteId
        })
        flyToLngLat(map, gcResult.lngLat)
    }

    const pointerEvents = (
        map:Map, 
        layerId:string,
        highlight:boolean = false, 
        idCol:string="id") => {
        if (!map) return undefined;
        map.on('mouseenter', layerId, () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', layerId, () => {
            map.getCanvas().style.cursor = '';
        });
       
       map.on('click', layerId, async (e) => {
            let id = idCol === "id" ? e.features[0][idCol] : e.features[0].properties[idCol];
            await siteNav(id)
        })

        if (highlight) {
            map.on('mouseenter', layerId, (e) => {
                idCol === "id" ? e.features[0][idCol] : e.features[0].properties[idCol];
                highlighted.set(e.features[0][idCol]);
            })

            map.on('mouseleave', layerId, () => {
                highlighted.set(null);
            })
        }
    }

    const clearLayers = async (map:Map, layerIds:string[]) => {
        if (!map) return undefined;
        layerIds.forEach((layerId) => {
            if (typeof map.getLayer(layerId) !== "undefined") {
                map.removeLayer(layerId);
            }
            if (typeof map.getSource(layerId) !== "undefined") {
                map.removeSource(layerId);
            }
        })

        map.flyTo({ pitch: 30, bearing: -50 })  
    }

    const getLabelLayerId = (map:Map) => {
        if (!map) return undefined;
        const layers = map.getStyle().layers;
        return layers.find(
            (layer) => layer.type === 'symbol' && layer.layout['text-field']
        ).id;
    }

    const getPaintOrLayout = (map:Map, layerId:string, property:string) => {
        const layer = map.getLayer(layerId);
        if (property in layer.paint) {
            return "paint"
        } else if (property in layer.layout) {
            return "layout"
        } else {
            undefined
        }
    }

    const animateProperty = (
        map:Map, 
        layerId:string, 
        property:string, 
        end:number | number[], 
        duration:number, 
        bounce:boolean = false, 
        delay:number = 40) => {
        if (!map) return undefined;
        let start;
        let delta;
        let step;
        let progress;

        let type = getPaintOrLayout(map, layerId, property)
        if (type === "paint") {
            start = map.getPaintProperty(layerId, property)
        } else if (type === "layout") {
            start = map.getLayoutProperty(layerId, property)
        }
        
        let val = start;
        if (Array.isArray(end)) {
            delta = end.map((a, i) => a - start[i]);
            step = delta.map((a) => a * (delay / duration));
            progress = [0, 0];
        } else {
            delta = (end - start);
            step = delta * (delay / duration);
            progress = 0;
        }
        
        return setInterval(() => {
            if (type === "paint") {
                map.setPaintProperty(layerId, property, val);
            } else if (type === "layout") {
                map.setLayoutProperty(layerId, property, val);
            }
            if (Array.isArray(end)) {
                val = val.map((a, i) => a + step[i])
                progress = progress.map((a, i) => a + step[i]);
            } else {
                val += step
                progress += step
            }
            if (!bounce && Math.abs(progress) >= Math.abs(delta)) {
                val = start;
                if (Array.isArray(end)) {
                    progress = [0, 0]
                } else {
                    progress = 0;
                }
            }
            if (bounce && Math.abs(progress) >= Math.abs(delta)) {
                if (Array.isArray(end)) {
                    step = step.map((a) => -a)
                    progress = [0, 0];
                } else {
                    step = -step;
                    progress = 0;
                }
            }
        }, 
        delay
        )
    }

    const animateCircles = (
        map:Map, 
        layerId:string) => {
        if (!map) return undefined;
        intervals.circles.push(animateProperty(map, layerId, 'circle-radius', 20, 1000))
        intervals.circles.push(animateProperty(map, layerId, 'circle-opacity', 0, 1000))
    }

    // const animateMarkers = (map:Map, layerId):string => {
    //     if (!map) return undefined;
    //     intervals.markers.push(animateProperty(map, layerId, 'text-offset', [0, -0.35], 1000))
    // }

    const clearIntervals = (intervalArray: NodeJS.Timeout[]) => {
        intervalArray.forEach((interval) => {
            clearInterval(interval);
        })
    }

    const addCircles = async (
        map:Map, 
        geojson:FeatureCollection|Feature, 
        layerId:string, 
        color:string) => {
        await clearLayers(map, [layerId])
        clearIntervals(intervals.circles);
        map.addLayer({
            id: layerId,
            source: {
                type: 'geojson',
                data: geojson
            },
            type: 'circle',
            paint: {
                "circle-radius": 0,
                "circle-pitch-alignment": "map",
                "circle-color": color,
                "circle-opacity": 1
            }
        });
        animateCircles(map, layerId);
        pointerEvents(map, layerId, true);
    }

    const addMarkers = async (
        map:Map, 
        geojson:FeatureCollection|Feature, 
        layerId:string, 
        color:string) => {
        await clearLayers(map, [layerId])
        // clearIntervals(intervals.markers);
        map.addLayer({
            id: layerId,
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
                'text-color': color,
                'text-halo-blur': 1
            }
        });
        // animateMarkers(map, layerId);
        pointerEvents(map, layerId, true);
    }

    const renderGeoJSONLayer = async (
        map:Map, 
        geojson:FeatureCollection|Feature) => {
        if (!map) return undefined;
        if(Object.keys(geojson).length > 1) {
            await addCircles(map, geojson, "selectedCircles", styles.primary);
            await addMarkers(map, geojson, "selectedMarkers", styles.primary);
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
    const toggleLayerVisibility = (
        map:Map, 
        layerId: string,
        condition:boolean) => {
        if (!map) return undefined;
        if (!condition) {
            // Set the visibility to 'none' to hide the layer
            map.setLayoutProperty(layerId, 'visibility', 'none');
        } else {
            // Set the visibility to 'visible' to show the layer
            map.setLayoutProperty(layerId, 'visibility', 'visible');
        }
    }

    const highlightHovered = (
        map:Map, 
        highlighted:string|number, 
        layerId:string) => {
        if (!map) return undefined;
        if (!highlighted) {
            map.setPaintProperty(layerId, 'text-opacity', 1)
        } else {
            map.setPaintProperty(
                layerId,
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
    $: $mapLoaded && $gcResult ? flyToQuery(map, $gcResult) : null;
    $: $mapLoaded && $metacorp ? renderGeoJSONLayer(map, $metacorp.sites) : null;
    $: $mapLoaded && $site ? renderGeoJSONLayer(map, $site) : null;
    $: $mapLoaded && $highlighted ? highlightHovered(map, $highlighted, "selectedMarkers") : null;

    // Clear selected markers when "Return to Map" button is clicked
    $: $mapLoaded && !$site && !$metacorp ? clearIntervals(intervals.circles) : null;
    $: $mapLoaded && !$site && !$metacorp && map.getLayer("selectedMarkers") ? clearLayers(map, ["selectedMarkers", "selectedCircles"]) : null;

    // $: toggleLayerVisibility($homeState, "hexes");

    onMount(() => {
        mobile = Device.isPhone;
        let mapOptions:MapOptions = {
            container: "map",
            style: style,
            center: initLngLat,
            zoom: initZoom.length === 2 ? initZoom[0] : initZoom,
            bearing: mapConfig.init.bearing,
            pitch: mapConfig.init.pitch,
            projection: projection,
            maxBounds: maxBounds,
            maxZoom: resultZoom
        };

        map = new mapbox.Map(mapOptions)

        map.on("load", async () => {
            map.addSource("sites", {
                type: "vector",
                url: "mapbox://mit-spatial-action.who-owns-mass-sites",
            });

            map.addLayer({
                id: "sites",
                source: "sites",
                // maxzoom: resultZoom,
                "source-layer": "geographies",
                type: "circle",
                paint: {
                    "circle-pitch-alignment": "map",
                    "circle-radius": [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        resultZoom - 4,
                        0,
                        resultZoom,
                        8
                    ],
                    "circle-color": styles.primary,
                    "circle-stroke-color": "white",
                    "circle-stroke-width": [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        resultZoom - 4,
                        0,
                        resultZoom,
                        1.5
                    ],
                    "circle-opacity": [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        resultZoom - 4,
                        0,
                        resultZoom,
                        0.7
                    ]
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

        map.getCanvasContainer().addEventListener('mouseleave', () => {
            popup.remove();
        });

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


            map.addSource('mapbox-dem', {
                type: 'raster-dem',
                url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
                tileSize: 512,
                maxzoom: 18
            })

            map.setTerrain({source: 'mapbox-dem', exaggeration: 2.5})

            pointerEvents(map, "sites", false, "site_id");

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
        if (intervals.circles) clearIntervals(intervals.circles);
    });

</script>

<div id="map"></div>

<style>
    #map {
        height: 100%;
        width: 100%;
    }
</style>