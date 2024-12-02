<script lang="ts">
    import { gcResult } from "$lib/stores";

    import { slide } from 'svelte/transition';
    export let suggestions = [];

    const handleClick = (suggestion) => {
        (document.getElementById('searchbar') as HTMLInputElement).value = suggestion.text
        suggestions = [];
        gcResult.set({
            lngLat: suggestion.lngLat,
            address: suggestion.address
        })
    }
</script>

<div>
<div 
    id="suggestions-list" 
    class="card has-background-white"
    >
    {#each suggestions as suggestion }
        <button transition:slide={{duration:250, axis:'y'}} class="suggestion px-2 button is-fullwidth is-small is-justify-content-flex-start"
        on:click={() => handleClick(suggestion)}>
            <span class="icon">
                <i class="fa-solid fa-address-book"></i>
            </span>
            <span>
                {suggestion.text}, {suggestion.location}
            </span>
        </button>
    {/each}
</div>
</div>

<style>
    .suggestion {
        overflow: hidden;
    }
</style>