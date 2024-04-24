<script>
    import { onMount, getContext, onDestroy } from 'svelte'
    import { mapboxgl, mapState } from '$lib/scripts/stores.js';
    // import SearchGeocoder from '$lib/components/Map/Geocoders/SearchCombined.svelte';
    import site_data from '$lib/config/instance.json';
    import Device from 'svelte-device-info';
    import { get } from 'svelte/store'
    import { goto } from '$app/navigation';

    export let token;

    import 'mapbox-gl/dist/mapbox-gl.css';

    // Setting defaults.
    export let style =  "mapbox://styles/mit-spatial-action/cluwwvx8l00gi01pe8mi4e64o";
    export let projection = 'globe';
    export let initLngLat = new mapboxgl.LngLat(
        site_data.map.init.lngLat[0], 
        site_data.map.init.lngLat[1]
    )
    export let initZoom = site_data.map.init.zoom;
    export let initZoomDur  = 500; //change back to 3000 after dev
    export let maxBounds = [
        [-179,19], 
        [-67,72]
    ]
    export let resultZoom = 10;
    export let resultFlySpeed = 2000;

    function flyToLngLat(lngLat){
        map.flyTo({
            center: lngLat,
            zoom: (map.getZoom() > resultZoom) ? map.getZoom() : resultZoom,
            duration: resultFlySpeed,
            essential: true
        });
    }

    $: (lngLat) ? flyToLngLat(lngLat) : null;

    let map;
    let lngLat;
    let mobile;

    function initMap(container) {
        const mapOptions = {
            container: container,
            style: style,
            center: initLngLat,
            zoom: (initZoom.length === 2) ? initZoom[0] : initZoom,
            bearing: 0,
            projection: projection,
            maxBounds: maxBounds
        }

        mobile = Device.isPhone;
        mapboxgl.accessToken = token;
        map = new mapboxgl.Map(mapOptions)
        mapState.set(map)

        map.on('load', () => {
            map.resize()
            map.addSource('sample-evictions', {
                type: 'vector',
               url: "mapbox://mit-spatial-action.cluwwxboq41sc1umn4mld8fea-2owb9"
            })
            map.addLayer(
                {
                    id:"evictions", 
                    source: "sample-evictions",
                    'source-layer': "Sample-Evictions",
                    type: "circle",
                    paint: {
                        'circle-radius': [
                            "interpolate",
                            ["linear"],
                            ["get", "evictions"],
                            0, 0,
                            400, 30],
                        'circle-color': '#FF5F05',
                        'circle-opacity': 0.7
                        }
                    }
            )
            //TODO: create shared functions to 1) clear selected geometries and 2) handle url change. Maybe call when change to selectedFeature?
            map.on('click', (e) => {
                lngLat = e.lngLat;

                let features = map.queryRenderedFeatures(e.point, { layers: ['evictions'] });
                if (features.length) {
                    goto('/location/' + features[0].properties.eviction_rank)
                }
            })
        })
        mapState.set(map)
    }
</script>

<div use:initMap style="height: inherit; width: 100%;" />