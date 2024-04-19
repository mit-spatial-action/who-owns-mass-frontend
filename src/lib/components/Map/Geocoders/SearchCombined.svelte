<script>
    import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
    import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
    import { onMount, onDestroy } from 'svelte';
    import { mapbox } from '$lib/scripts/utils';
    import { getMap } from '$lib/scripts/stores.js';
    import sampleEvictions from '$lib/config/sample-evictions.json';


    import Device from 'svelte-device-info'
    $: mobile = Device.isPhone;

   let map;
   const unsubscribeMap = getMap.subscribe(retrieveMap => {
    map = retrieveMap();   // TODO: does each click count as a map call in our 50,000 quota?
   });

    let coords;

    // Search functionality 
    //      Option 1 - show megacorp names (fly to and update selected features)
    //      Option 2 - show address names w/ evictions (fly to and update selected feature)
    //      Option 3 - show all addresses (flyto)

    function forwardGeocoder(query) {
        const matchingOwners = [];
        const matchingAddresses = [];
        for (const feature of sampleEvictions.features) {
            // Handle queries with different capitalization
            // than the source data by calling toLowerCase().
            if (
                feature.properties.landlord_name.toLowerCase().includes(query.toLowerCase())
            ) {
                feature['place_name'] = `💰 ${feature.properties.landlord_name}`; // NOTE - "place_name" is a variable used by Mapbox. 
                feature['center'] = feature.geometry.coordinates;
                feature['data_type'] = "owner";
                matchingOwners.push(feature);
            }

            if (
                feature.properties.place_name.toLowerCase().includes(query.toLowerCase())
            ) {
                feature['place_name'] = `🎯 ${feature.properties.place_name}`; // NOTE - "place_name" is a variable used by Mapbox. 
                feature['center'] = feature.geometry.coordinates;
                feature['data_type'] = "address";
                matchingAddresses.push(feature);
            }
        }
        var matchingFeatures = matchingOwners.concat(matchingAddresses);
        console.log(matchingFeatures);
        return matchingFeatures;
    }

    const SearchGeocoder = new MapboxGeocoder({
            accessToken: mapbox.accessToken,
            localGeocoder: forwardGeocoder,
            zoom: 14,
            placeholder: 'Corp. Name or Address',
            mapboxgl: mapbox,
            marker: false,
            countries: 'us',
            types: 'address,poi',
        });

    onMount(()=>{
        document.getElementById('geocoder').appendChild(SearchGeocoder.onAdd(map));
    });

    onDestroy(() => {
        unsubscribeMap();
    });
    
</script>