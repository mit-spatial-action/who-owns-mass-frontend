<script>
    import { selectedFeature } from '$lib/scripts/stores.js';
    import { onMount } from 'svelte';
    /** @type {import('./$types').PageData} */
   
    const links = ["Statistics", "Property Information"];

</script>

<div>
    <hr/>
    <p class="has-text-dark is-size-4 has-text-left block mb-1">
        <b>Download Datasets</b>
    </p>
    <div class="has-text-left block"> 
        {#each links as item, index (index)}
            <span class="has-text-link"><u>{item}</u></span>
            <br/>
        {/each}     
    </div>
</div>
