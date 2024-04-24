<script>
    import { afterUpdate, onMount, onDestroy } from 'svelte';
    import SearchBar from '$lib/components/SearchBar.svelte';
    import { remountSearchbar, selectedFeature } from '$lib/scripts/stores.js';


    export let title = "Title";
    export let subtitle = "Longer description";
    let loadState = false;

    const unsubscribe = selectedFeature.subscribe(value => {
        console.log('feature: ', value);
    });

    onMount(() => {
        loadState = true;
    });

    afterUpdate(() => {
        if (document.getElementById('geocoder')){
            let length = document.getElementById('geocoder').children.length;

            if (length == 0){
                remountSearchbar.update((n) => n+1);
            }
       }
    })

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
        ]

</script>
{#if loadState }
    <div class="home-panel">
        <div class="title has-text-dark is-size-1 has-text-centered">
            {title}
        </div>
        <div class="subtitle mt-1 has-text-dark is-size-6 has-text-centered">
                {subtitle}
        </div>
        <div class="centered">
            {#key $selectedFeature}
                 <SearchBar key={$selectedFeature} on:search={handleSearch} />
            {/key}
        </div>
    </div>
{/if}





