<script>
    import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
    import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
    import { onMount, onDestroy } from 'svelte';
    import { mapbox } from '$lib/scripts/utils';
    import { gcResult } from "$lib/scripts/stores.js";

    const mapbox_token = import.meta.env.VITE_PUBLIC_MAPBOX_TOKEN;

    const geocoder = new MapboxGeocoder({
            accessToken: mapbox_token,
            placeholder: 'Search for an address!',
            marker: false,
            countries: 'us',
            flyTo: false,
            types: 'address',
            bbox: [
                -73.507239199792,
                41.23908260581605,
                -69.92871308883089,
                42.88675909238091
            ],
        });

    onMount(()=>{
        geocoder.addTo("#geocoder");
        geocoder.on('result', (e) => {
            let result = e.result
            console.log(result);
            gcResult.set({
                lngLat: new mapbox.LngLat(result.center[0], result.center[1]),
                address: result.address + " " + result.text
            })
        })
    });
    
</script>

<div id="geocoder"></div>