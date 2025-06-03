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

<div class="menu">
    <ul class="menu-list">
    {#each suggestions as suggestion }
        <li>
        <button transition:slide={{duration:250, axis:'y'}} class="button px-2 py-1 is-small is-responsive"
        onclick={() => handleClick(suggestion)}>
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
        </li>
    {/each}
    </ul>
</div>

<style>
    .menu {
        overflow: hidden;
    }
</style>