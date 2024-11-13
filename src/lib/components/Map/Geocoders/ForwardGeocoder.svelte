<script lang="ts">
    import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
    import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
    import { onMount, onDestroy } from 'svelte';
    import { mapbox } from '$lib/scripts/utils';
    import { gcResult } from "$lib/stores";
    
    import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';

    const geocoder = new MapboxGeocoder({
            accessToken: PUBLIC_MAPBOX_TOKEN,
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
            filter: function (item) {
                return item.context.some((i) => {
                    return (
                        i.id.split('.').shift() === 'region' &&
                        i.text === 'Massachusetts'
                    );
                });
            }
        });

    onMount(()=>{
        geocoder.addTo("#geocoder");
        geocoder.on('result', (e) => {
            let result = e.result
            gcResult.set({
                lngLat: new mapbox.LngLat(result.center[0], result.center[1]),
                address: result.address + " " + result.text
            })
        })
    });

    onDestroy(()=>{
        if (geocoder && geocoder.parentNode ) {
            geocoder.onRemove();
        }
    });
    
</script>

<div id="geocoder"></div>