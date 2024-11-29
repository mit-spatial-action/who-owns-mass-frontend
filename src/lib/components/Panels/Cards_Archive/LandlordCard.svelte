<script>
    import { selectedFeature } from "$lib/scripts/stores.ts";
    import { onDestroy } from "svelte";
    import LandlordEvictionsGraph from "$lib/components/Panels/Cards/LandlordEvictionsGraph.svelte";
    import CorporateAddressCard from "$lib/components/Panels/Cards/CorporateAddressCard.svelte";
    // import { company } from "$lib/scripts/stores.js";
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
        <!-- <b>About this Landlord</b> -->
    </p>
    <div class="has-text-left block">
        <!-- <p>Owner Name: {$company.owner[0].name}</p> -->
        <!-- <p>This company (is/is not) a trust and (does/does not) have trustees.</p> -->
    </div>
</div>
