<script>
    import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
    import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
    import { onMount, onDestroy } from 'svelte';
    import { mapbox } from '$lib/scripts/utils';
    import { getMap } from '$lib/scripts/stores.js';


    import Device from 'svelte-device-info'
    $: mobile = Device.isPhone;

   let map;
   const unsubscribeMap = getMap.subscribe(retrieveMap => {
    map = retrieveMap();   // TODO: does each click count as a map call in our 50,000 quota?
   });

    export let gcResult;

    const geocoder = new MapboxGeocoder({
            accessToken: mapbox.accessToken,
            // localGeocoder: forwardGeocoder,
            zoom: 14,
            placeholder: 'Search for an address in Massachusetts',
            mapboxgl: mapbox,
            marker: false,
            countries: 'us',
            flyTo: false,
            types: 'address',
            bbox: [-73.507239199792,41.23908260581605,-69.92871308883089,42.88675909238091],
            // filter: function (item) {
            //     // returns true if item contains New South Wales region
            //     return item.context.some((i) => {
            //         // ID is in the form {index}.{id} per https://github.com/mapbox/carmen/blob/master/carmen-geojson.md
            //         // This example searches for the `region`
            //         // named `New South Wales`.
            //         return (
            //             i.id.split('.').shift() === 'region' &&
            //             i.text === 'Massachusetts'
            //         );
            //     });
            // },
        });

    onMount(()=>{
        document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
        geocoder.on('result', (e) => {
            let result = e.result
            console.log(result);
            gcResult = {
                lngLat: new mapbox.LngLat(result.center[0], result.center[1]),
                address: result.address + " " + result.text
            }
        })
    });

    onDestroy(() => {
        unsubscribeMap();
    });
    
</script>