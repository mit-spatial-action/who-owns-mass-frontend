<script>

    import {
        selectedFeature,
        metacorp,
        company_id
    } from "$lib/scripts/stores.js";
    import { onDestroy, createEventDispatcher } from "svelte";
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

    function callOnCompany(id) {
        company_id.set(id)
    }

</script>

    {#if $metacorp.aliases.length > 1}
    <hr />
    <p class="has-text-dark is-size-4 has-text-left block mb-1">
        <b>Associated Companies</b>
    </p>
    <div class="has-text-left block" id="other-names-box">
        <ol type="1">
            {#each $metacorp.aliases as alias}
                <li>
                    <!-- <a on:click={callOnCompany(item.id)} class="has-text-link"> -->
                        {alias}
                    <!-- </a> -->
                </li>
            {/each}
        </ol>
    </div>
    {/if}
        <!-- <div class="has-text-left block">
        <span class="has-text-link mb-1"><u>View corporate addresses</u></span>
    </div> -->

<style>
    #other-names-box {
        max-height: 200px;
        overflow-y: scroll;
    }
</style>
