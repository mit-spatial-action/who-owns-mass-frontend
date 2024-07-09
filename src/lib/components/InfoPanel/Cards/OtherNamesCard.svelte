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
    <div class="has-text-left block" id="other-names-box">
        <ol type="1">
            {#each $company.metacorp.related.institutions as item, index (index)}
                {#if item.id != $company.id}
                    <li>
                        <a
                            on:click={$getCompany(item.id)}
                            class="has-text-link"
                        >
                            <u>{item.name}</u>
                        </a>
                    </li>
                {/if}
            {/each}
        </ol>
    </div>
    <div class="has-text-left block">
        <span class="has-text-link mb-1"><u>View corporate addresses</u></span>
    </div>
</div>

<style>
    #other-names-box {
        max-height: 200px;
        overflow-y: scroll;
    }
</style>
