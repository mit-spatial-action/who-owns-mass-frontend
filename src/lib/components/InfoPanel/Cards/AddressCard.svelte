<script>
    import { selectedFeature } from '$lib/scripts/stores.js';
    import { onDestroy } from 'svelte';
    import { company } from "$lib/scripts/stores.js";

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
        <b>About this Property</b>
    </p>
    <div class="has-text-left block"> 
        <p>{$company.name} is located at {$company.address.addr}, {$company.address.muni_str} MA, {$company.address.postal}<p/>
        <p>Its last assessed property value was $____ in _______</p>
    </div>
</div>
