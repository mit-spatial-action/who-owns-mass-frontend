<script>
    import { selectedFeature } from '$lib/scripts/stores.js';
    import { onMount } from 'svelte';
    /** @type {import('./$types').PageData} */

   
    const otherNames = JSON.parse($selectedFeature[0].properties.other_names);
    console.log(typeof otherNames);
    console.log(otherNames);
</script>

<div>
    <hr/>
    <p class="has-text-dark is-size-4 has-text-left block mb-1">
        <b>Also known as</b>
    </p>
    <div class="has-text-left block"> 
        {#each otherNames as item, index (index)}
            <span class="has-text-link"><u>{item}</u></span>
            <br/>
        {/each}     
    </div>
</div>
