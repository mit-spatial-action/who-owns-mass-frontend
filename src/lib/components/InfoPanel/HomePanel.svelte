<script>
    import { afterUpdate, onMount, onDestroy } from "svelte";
    import SearchBar from "$lib/components/SearchBar.svelte";
    import InfoPanel from "$lib/components/InfoPanel/InfoPanel.svelte";
    import { remountSearchbar, site, metacorp, infoMode, loadState } from "$lib/scripts/stores.js";

    /** @type {import('./$types').PageData} */
    //import { getContext, setContext } from 'svelte';

    export let title = "Title";
    export let subtitle = "Longer description";
    export let mapbox_token;

    onMount(() => {
        loadState.set(true);
    });
    console.log(infoMode)

    afterUpdate(() => {
        if (document.getElementById("geocoder")) {
            let length = document.getElementById("geocoder").children.length;

            if (length == 0) {
                remountSearchbar.update((n) => n + 1);
            }
        }
    });

    function handleSearch(event) {
        const searchTerm = event.detail;
        // TODO: add logic to update the map based on the search term
    }

    //Home page tab button names
    $: items = [
        {
            desc: "Top Statistics",
        },
        {
            desc: "Random Evictor",
        },
        {
            desc: "Eviction Primer",
        },
        {
            desc: "What happeneds in court?",
        },
        {
            desc: "Reports",
        },
        {
            desc: "Gallery",
        },
    ];

</script>

{#if loadState}
    {#if $infoMode === "home"}
        <div class="home-panel p-5">
            <div class="title has-text-dark is-size-1 has-text-centered">
                {title}
            </div>
            <div
                class="subtitle mt-1 has-text-dark is-size-6 has-text-centered m-6 px-6"
            >
                {subtitle}
            </div>
            <div class="centered">
                {#key $site}
                    <SearchBar
                        key={$site}
                        on:search={handleSearch}
                    />
                {/key}
            </div>
        </div>
    {:else}
        <InfoPanel />
    {/if}
{/if}
