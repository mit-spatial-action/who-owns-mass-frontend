<!-- QueryFeaturesSearchBar.svelte -->
<script>
    import { onMount } from 'svelte';
    import mapboxgl from 'mapbox-gl';
    //import { urlParams } from './urlStore.js';
    import { getMap, remountSearchbar, selectedFeature } from '$lib/scripts/stores.js';
  
    let searchInput = '';
    let searchResults = [];

    let map;
    const unsubscribeMap = getMap.subscribe(retrieveMap => {
        map = retrieveMap();   
    });

    async function performSearch(query) {
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapbox_token}`);
        const data = await response.json();
        return data.features;
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



  