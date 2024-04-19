<script>
    import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
    import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';


    import { onMount, onDestroy } from 'svelte';
    import { mapbox, key } from '$lib/scripts/utils';
    import { getMap } from '$lib/scripts/stores.js';

    import Device from 'svelte-device-info'
    $: mobile = Device.isPhone;

   let map;
   const unsubscribeMap = getMap.subscribe(retrieveMap => {
    map = retrieveMap();   // TODO: does each click count as a map call in our 50,000 quota?
   });

    let coords;

    const SearchGeocoder = new MapboxGeocoder({
        accessToken: mapbox.accessToken,
        mapboxgl: mapbox,
        countries: 'us',
        types: 'address,poi',
        placeholder: 'Corp. Name or Address',
        marker: false
    });

    onMount(()=>{
        document.getElementById('geocoder').appendChild(SearchGeocoder.onAdd(map));
    });

    onDestroy(() => {
        unsubscribeMap();
    });
    
</script>