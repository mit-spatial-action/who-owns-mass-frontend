<script>
    import { selectedFeature } from '$lib/scripts/stores.ts';
    import { onDestroy } from 'svelte';
    /** @type {import('./$types').PageData} */

    const unsubscribe = selectedFeature.subscribe(value => {
    });

    onDestroy(() => {
        unsubscribe();
    });

</script>

<div>
    <p class="has-text-dark is-size-6 has-text-left block mb-1">
        <b>Corporate Addresses: </b>
    </p>
    <div class="has-text-left block"> 
        {#each JSON.parse($selectedFeature[0].properties.corporate_addresses) as address, index (index)}
            <span class="has-text-link">{address}</span>
            <br/>
        {/each}     
    </div>
</div>
