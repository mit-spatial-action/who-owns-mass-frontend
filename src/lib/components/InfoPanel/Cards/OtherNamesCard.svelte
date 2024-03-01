<script>
    import { selectedFeature } from '$lib/scripts/stores.js';
    import { onMount } from 'svelte';
    /** @type {import('./$types').PageData} */

   
    const otherNames = $selectedFeature[0].properties.other_names
</script>

<div>
    <hr/>
    <div class="title has-text-dark is-size-4 has-text-left block">
    Also known as
        </div>
    <div>
        {#each otherNames as item, index (index)}
        <span class="has-text-link">{item}</span>
        {/each}     
    </div>
</div>
