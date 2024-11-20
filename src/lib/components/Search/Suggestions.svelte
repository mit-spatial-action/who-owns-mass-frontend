<script lang="ts">
    import { gcResult } from "$lib/stores";

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

<div id="suggestions-list" class="card has-background-white">
    {#each suggestions as suggestion }
        <button class="button is-fullwidth is-small is-justify-content-flex-start"
        on:click={() => handleClick(suggestion)}>
        <span class="icon">
            <i class="fa-solid fa-address-book"></i>
        </span>
        <span>
            {suggestion.text}
        </span>
        </button>
    {/each}
</div>