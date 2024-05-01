<script>
    import { selectedFeature } from '$lib/scripts/stores.js';
    import { onDestroy } from 'svelte';

    /** @type {import('./$types').PageData} */

    const unsubscribe = selectedFeature.subscribe(value => {
    });

    onDestroy(() => {
        unsubscribe();
    });

</script>

<div>
    <hr/>
    <p class="has-text-dark is-size-4 has-text-left block mb-1">
        <b>About this Address</b>
    </p>
    <div class="has-text-left block"> 
        <p>{$selectedFeature[0].properties.place_name} <p/>
       <p> Approximately <b>10 tenants</b> have been evicted from this address alone.</p>    
    </div>
</div>
