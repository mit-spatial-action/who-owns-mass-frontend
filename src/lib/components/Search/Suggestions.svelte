<script lang="ts">
    import { goto } from "$app/navigation";
    import { gcResult, metacorp} from "$lib/stores";

    import { slide } from 'svelte/transition';
    export let suggestions = [];

    const handleClick = (suggestion) => {
        (document.getElementById('searchbar') as HTMLInputElement).value = suggestion.text
        suggestions = [];
        if(suggestion.lngLat){
            gcResult.set({
                lngLat: suggestion.lngLat,
                address: suggestion.address
            }) 
        } else if (suggestion.metacorp){
            goto(`/meta/${suggestion.metacorp}`);
        }
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
                {#if suggestion.location }
                     {suggestion.text}, {suggestion.location}
                {:else}
                     {suggestion.text}
                {/if}
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