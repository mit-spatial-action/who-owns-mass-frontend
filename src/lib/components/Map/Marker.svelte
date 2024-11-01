<script>
    import { getContext, onDestroy } from 'svelte';
    import { mapbox, key } from '$lib/scripts/utils';
    import site_data from '$lib/config/instance.json';
    import { getMap } from '$lib/scripts/stores.js';


    let map;
    const unsubscribeMap = getMap.subscribe(retrieveMap => {
        map = retrieveMap();   
   });

    export let lngLat;
    export let marker;

    function addMarker(ll) {
        (marker !== undefined) ? marker.remove() : null;
        if (ll !== undefined) {
            marker = new mapbox.Marker({
                    color: site_data.primaryColor
                }).setLngLat(ll);
            marker.addTo(map);
        }
    }

    $: addMarker(lngLat);

    onDestroy(() => {
        unsubscribeMap();
    });
</script>