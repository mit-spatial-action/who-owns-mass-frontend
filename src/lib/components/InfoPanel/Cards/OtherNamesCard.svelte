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
    function toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
        );
    }
</script>

<div>
    <hr />
    <p class="has-text-dark is-size-4 has-text-left block mb-1">
        <b>Also known as</b>
    </p>
    <div class="has-text-left block" id="other-names-box">
        <ol type="1">
            {#if $company.metacorp}
                {#if $company.metacorp.related}
                    {#each $company.metacorp.related.companies as item, index (index)}
                        {@const name = toTitleCase(item.name)}
                        <li>
                            <a on:click={$getCompany(item.id)} class="has-text-link">
                                <u>{name}</u>
                            </a>
                        </li>
                    {/each}
                {/if}
            {/if}
        </ol>
    </div>
    <!-- <div class="has-text-left block">
        <span class="has-text-link mb-1"><u>View corporate addresses</u></span>
    </div> -->
</div>

<style>
    #other-names-box {
        max-height: 200px;
        overflow-y: scroll;
    }
</style>
