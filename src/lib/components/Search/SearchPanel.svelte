<script>
    import GeocoderSearch from "$lib/components/Search/GeocoderSearch.svelte";
    import Searchbar from "$lib/components/Search/Searchbar.svelte";
    import Suggestions from "$lib/components/Search/Suggestions.svelte";
    import ErrorMessage from "$lib/components/Panels/ErrorMessage.svelte";

    const searchModes = [
        {
            displayName: "Address",
            id: "address"
        },
        {
            displayName: "Owner",
            id: "owner"
        }
    ]

    let suggestions = $state([]);
    const initMode = searchModes[0].id
    let hoverTab = $state(initMode);
    let activeTab = $state(initMode);

    const setHover = (id) => {
        hoverTab = id;
    }
    const setActive = (id) => {
        activeTab = id;
    }
</script>

<div class="panel is-success">
    <div class="panel-heading is-size-7 is-size-6-tablet">Search for an Address or Owner</div>
    <div class="panel-tabs is-size-7 is-size-6-tablet">
        {#each searchModes as mode}
            <a 
            class:is-active={mode.id === hoverTab} 
            onmouseenter={() => setHover(mode.id)}
            onmouseleave={() => setHover(activeTab)}
            onclick ={() => setActive(mode.id)}
            >{mode.displayName}</a>
        {/each}
    </div>
    <div class="panel-block is-flex is-justify-content-center">
        <div class="control">
            {#if activeTab==="address"}
                <Searchbar/>
                <GeocoderSearch bind:suggestions />
            {:else}
                <ErrorMessage errorState="featureNotReady"/>
            {/if}
            <Suggestions bind:suggestions/>
        </div>
    </div>
  </div>