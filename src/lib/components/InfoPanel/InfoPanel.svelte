<script>
    import { afterUpdate, onMount, onDestroy } from "svelte";
    /** @type {import('./$types').PageData} */
    // import { getContext } from "svelte";
    // import { mapbox, key } from "$lib/scripts/utils";
    import { selectedFeature, getMap } from "$lib/scripts/stores.js";
    import OtherNamesCard from "$lib/components/InfoPanel/Cards/OtherNamesCard.svelte";
    import DownloadDatasetsCard from "$lib/components/InfoPanel/Cards/DownloadDatasetsCard.svelte";
    import MetacorpCard from "$lib/components/InfoPanel/Cards/MetacorpCard.svelte";
    import AddressCard from "$lib/components/InfoPanel/Cards/AddressCard.svelte";
    import LandlordCard from "$lib/components/InfoPanel/Cards/LandlordCard.svelte";
    import { company, metacorp, site } from "$lib/scripts/stores.js";

    //import {Link, Route} from 'svelte-routing';

    let loadState = false;
    onMount(() => {
        loadState = true;
    });

    //const selectedFeature = getContext('selectedFeature');
    const unsubscribe = selectedFeature.subscribe((value) => {
    });

    let map;
    const unsubscribeMap = getMap.subscribe((retrieveMap) => {
        map = retrieveMap();
    });

    function clearState() {
        selectedFeature.set([]);
        map.removeLayer("selectedGeom");
        map.removeSource("selectedGeom");

        map.removeLayer("affiliates");
        map.removeSource("affiliates");

        map.removeLayer("network");
        map.removeSource("routes");

        const newUrl = `/`;
        window.history.pushState({}, "", newUrl);
    }

    onDestroy(() => {
        unsubscribe();
        unsubscribeMap();
    });
</script>

{#if loadState}
    <div class="is-flex-align-start mx-5">
        <p class="block mt-2 is-size-5 has-text-weight-bold" on:click={clearState}>
            <span class="has-text-link"> &#8592 </span>
            <u>Back</u> to search
        </p>
        <!-- {#if $metacorp.prop_count > 1 } 

            <span
            class="has-text-dark p-1 px-2 is-size-6 has-text-left block has-text-weight-semibold is-uppercase has-background-danger">
                Corporate Landlord
            </span>
        {/if} -->
        <div class="is-uppercase title has-text-dark is-size-1 mt-1 has-text-left block">
            {$site.properties.address.addr}
        </div>
        <div class="subtitle has-text-dark is-size-5 mt-1 has-text-left block">
            {$site.properties.address.muni}, {$site.properties.address.state}
        </div>
        <div class="subtitle has-text-dark is-size-5 mt-1 has-text-left block box">
            <div class="has-text-weight-bold">Owner(s)</div>
            {#each $site.properties.owners as owner}
                {owner.properties.name}
            {/each}
        </div>
        <div class="box">
            <div class="columns">
                <div class="column mr-1">
                    <div class="has-text-weight-bold">Year of Record</div>
                    {$site.properties.fy}
                </div>
                <div class="column mr-1">
                    <div class="has-text-weight-bold">Estimated Units</div>
                    {$site.properties.units}
                </div>
            </div>
            <div class="columns">
                <div class="column mr-1">
                    <div class="has-text-weight-bold">Last Sale Date</div>
                    {$site.properties.ls_date}
                </div>
                <div class="column mr-1">
                    <div class="has-text-weight-bold">Last Sale Price</div>
                    ${$site.properties.ls_price}
                </div>
            </div>
        </div>

        <!-- <div class="subtitle mt-1 mb-1 has-text-dark is-size-5 has-text-left block">
            {#if $metacorp.aliases.length > 1}
                This company is part of a network of {$metacorp.aliases.length} companies.
            {:else}
                There is only one company in this network.
            {/if}
        </div> -->
        <div class="columns">
            <div class="column mr-1">
                <div
                    class="subtitle mt-1 has-text-dark is-size-6 has-text-centered block"
                >
                    <!-- <OtherNamesCard /> -->
                    <!-- <AddressCard /> -->
                    <!-- <DownloadDatasetsCard /> -->
                    
                </div>
            </div>
            <!-- <div class="column">
                {#if $metacorp && $metacorp.related && $metacorp.related.companies_count && $metacorp.related.companies_count > 1}
                <MetacorpCard />
                {/if}
                <LandlordCard />
            </div> -->
        </div>
        
    </div>
{/if}
