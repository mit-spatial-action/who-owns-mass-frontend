<script>
    import {
        selectedFeature,
        company,
        getCompany,
    } from "$lib/scripts/stores.js";
    import { onDestroy } from "svelte";

    /** @type {import('./$types').PageData} */

    const unsubscribe = selectedFeature.subscribe((value) => {});

    onDestroy(() => {
        unsubscribe();
    });
</script>

<div>
    <hr />
    <p class="has-text-dark is-size-4 has-text-left block mb-1">
        <b>Also known as</b>
    </p>
    <div class="has-text-left block">
        {#each $company["metacorp"]["related"]["institutions"] as item, index (index)}
            {#if item.id != $company.id}
                <a on:click={$getCompany(item.id)} class="has-text-link">
                    <u>{item.name}</u>
                </a>
                <br />
            {/if}
        {/each}
    </div>
    <div class="has-text-left block">
        <span class="has-text-link mb-1"><u>View corporate addresses</u></span>
    </div>
</div>
