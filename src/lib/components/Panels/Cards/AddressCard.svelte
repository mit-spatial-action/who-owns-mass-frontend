<script>
    import { onDestroy } from 'svelte';
    import { metacorp } from "$lib/scripts/stores.ts";

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
        <p>{$metacorp.name} is located at ____, ____ MA, ___<p/>
        <p>Its last assessed property value was $____ in _______</p>
    </div>
</div>
