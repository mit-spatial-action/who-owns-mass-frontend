<!-- QueryFeaturesSearchBar.svelte -->
<script>
    import { onMount } from 'svelte';
    import mapboxgl from 'mapbox-gl';
    import { getMap, remountSearchbar, selectedFeature } from '$lib/scripts/stores.js';
    import sampleEvictions from '$lib/config/sample-evictions.json';
  
    export let mapbox_token;

    let searchInput = '';
    let searchResults = [];

    let map;
    const unsubscribeMap = getMap.subscribe(retrieveMap => {
        map = retrieveMap();   
    });

    async function performSearch(query) {

        //const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapbox_token}`);
        //const data = await response.json();
       // return data.features;

       //Loads GeoJSON elements from external file/cache
       // TODO: there may be a cleaner way to do this - load one time rather than each time text input is updated. 
      // const response = await fetch('$lib/config/sample-evictions.geojson');
      const data = sampleEvictions;

    // Extract properties for search
        const locations = data.features.map(feature => ({
          landlord_name: feature.properties.landlord_name,
          other_names: feature.properties.other_names, 
          id: feature.properties.id,
          place_name: feature.properties.place_name
      }));
      let filtered; 
      filtered = locations.filter(location => location.landlord_name.toLowerCase().includes(query.toLowerCase()));
       return filtered;
      }

      async function updateSearchResults() {
        searchResults = await performSearch(searchInput);
      }

      // Watch for changes in the searchInput
      $: {
        if (searchInput.length > 0) {
          updateSearchResults();
        } else {
          searchResults = [];
        }
      }

    function selectSearchResult(result) {
        map.flyTo({
        center: result.geometry.coordinates,
        zoom: 14
        });

        // Clear search input after selecting a result
        searchInput = '';
    }

</script>

<div id="querySearchBar">
  <input type="text" placeholder="Search for a location" bind:value={searchInput} />

  {#if searchResults.length > 0}
    <ul>
      {#each searchResults as result}
        <li on:click={() => selectSearchResult(result)}>{result.place_name}</li>
      {/each}
    </ul>
  {/if}
</div>



  