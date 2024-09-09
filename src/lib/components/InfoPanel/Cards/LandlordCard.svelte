<script>
    import { selectedFeature } from "$lib/scripts/stores.js";
    import { onDestroy } from "svelte";
    import LandlordEvictionsGraph from "$lib/components/InfoPanel/Cards/LandlordEvictionsGraph.svelte";
    import CorporateAddressCard from "$lib/components/InfoPanel/Cards/CorporateAddressCard.svelte";
    import { company } from "$lib/scripts/stores.js";
    window.company = company;
    /** @type {import('./$types').PageData} */

    const unsubscribe = selectedFeature.subscribe((value) => {});

    onDestroy(() => {
        unsubscribe();
    });
</script>

<div>
    <hr />
    <p class="has-text-dark is-size-4 has-text-left block mb-1">
        <b>About this Landlord</b>
    </p>
    <div class="has-text-left block">
        <p>
            {$selectedFeature[0].properties.landlord_name} has evicted {$selectedFeature[0]
                .properties.evictions} tenants
            <span class="has-text-success"
                ><u>across their 15 properties</u></span
            > in Massachusetts. Here's why:
        </p>
        <br />
        <p class="has-text-centered">[Placeholder pie chart]</p>
    </div>
</div>
