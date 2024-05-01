<script>
    import { afterUpdate, onMount, onDestroy } from 'svelte';
     /** @type {import('./$types').PageData} */
     import { getContext } from 'svelte';
     import { mapbox, key } from '$lib/scripts/utils';
     import { selectedFeature, getMap } from '$lib/scripts/stores.js';
     import  OtherNamesCard  from '$lib/components/InfoPanel/Cards/OtherNamesCard.svelte';
     import  PublicFundingCard  from '$lib/components/InfoPanel/Cards/PublicFundingCard.svelte';
     import  DownloadDatasetsCard  from '$lib/components/InfoPanel/Cards/DownloadDatasetsCard.svelte';


     //import {Link, Route} from 'svelte-routing';

    let loadState = false;
    onMount(() => {
        loadState = true;    
        console.log($selectedFeature);   
    });

    //const selectedFeature = getContext('selectedFeature');
    const unsubscribe = selectedFeature.subscribe(value => {
        console.log('feature: ', value);
    });
    
    let map;
    const unsubscribeMap = getMap.subscribe(retrieveMap => {
        map = retrieveMap();   
   });
   

    function clearState() {
        selectedFeature.set([]);  
        map.removeLayer('selectedGeom');
        map.removeSource('selectedGeom');
       
        const newUrl = `/`;
        window.history.pushState({ }, '', newUrl);
    }

    onDestroy(() => {
        unsubscribe();
        unsubscribeMap();
    });

</script>

{#if loadState }
    <div class="is-flex-align-start mx-5">

    <p class="block mt-2 is-size-5" on:click={clearState}>
        <span class="has-text-link">&#8592 </span><u>Back</u> to search
    </p>
    <span class="has-text-dark p-1 px-2 is-size-6 has-text-left block has-text-weight-semibold is-uppercase has-background-danger">
        Corporate Landlord
    </span>
    <div class="is-uppercase title has-text-dark is-size-1 mt-1 has-text-left block">
        {$selectedFeature[0].properties.landlord_name}
    </div>
    <div class="subtitle mt-1 has-text-dark is-size-5 has-text-left block">
        Between September, 2019, and February, 2022, <b>{$selectedFeature[0].properties.landlord_name}</b> was the 
        cause of <span class="has-background-warning">approximately <b>{$selectedFeature[0].properties.evictions}</b> people losing their homes or experiencing housing instability.</span>	
    </div>
    <div class="columns">
        <div class="column">
            <div class="subtitle mt-1 has-text-dark is-size-6 has-text-centered block">
            <OtherNamesCard />
            <PublicFundingCard /> 
            <DownloadDatasetsCard />
            </div>
        </div> 
        <div class="column">
            <div class="subtitle mt-1 has-text-dark is-size-6 has-text-centered block">
            Eviction Rank: { $selectedFeature[0].properties.eviction_rank } <br/>
            Evictions: {$selectedFeature[0].properties.evictions} <br/>
            Address: { $selectedFeature[0].properties.place_name} <br/>
            </div>
        </div> 
    </div>
    </div>
{/if}
