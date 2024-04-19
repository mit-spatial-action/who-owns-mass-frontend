<!-- QueryFeaturesSearchBar.svelte -->
<script>
    import { onDestroy } from 'svelte';
    import { getMap, selectedFeature } from '$lib/scripts/stores.js';
    import sampleEvictions from '$lib/config/sample-evictions.json';
  
   // export let mapbox_token;

    const unsubscribeSelectedFeature = selectedFeature.subscribe(value => {});

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
          place_name: feature.properties.place_name,
          geometry: feature.geometry.coordinates
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
        // ASYNC QUERY: 
        //     TODO: Selecting a search result updates the routing, which triggers a new selected feature query. This triggers changes to map nad info panel. 
        // For now, leaving as a flyTo at the result geometry. 

        map.flyTo({
        center: result.geometry,
        zoom: 14
        });

        // Clear search input after selecting a result
        searchInput = '';
    }

    onDestroy(() => {
        unsubscribeSelectedFeature();
        unsubscribeMap();
    });

</script>

<div id="querySearchBar">
  <input type="text" placeholder="Search for a location" bind:value={searchInput} />

  {#if searchResults.length > 0}
    <ul>
      {#each searchResults as result}
        <li on:click={() => selectSearchResult(result)}>{result.landlord_name}</li>
      {/each}
    </ul>
  {/if}
</div>



  