<script>
    import GeocoderSearch from "$lib/components/Search/GeocoderSearch.svelte";
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
    let hoverTab = searchModes[0].id;
    let activeTab = hoverTab;
    const setHover = (id) => {
        hoverTab = id;
    }
    const setActive = (id) => {
        activeTab = id;
    }
</script>

<div class="panel is-success">
    <div class="panel-heading">Search for an Address or Owner</div>
    <div class="panel-tabs">
        {#each searchModes as mode}
            <a 
            class:is-active={mode.id === hoverTab} 
            on:mouseenter={() => setHover(mode.id)}
            on:mouseleave={() => setHover(activeTab)}
            on:click ={() => setActive(mode.id)}
            >{mode.displayName}</a>
        {/each}
    </div>
    <div class="panel-block is-flex is-justify-content-center">
        <div class="control">
            {#if activeTab==="address"}
                <GeocoderSearch />
            {:else}
                <p class="control has-icons-left">
                    <input class="input" type="text" placeholder="Search" />
                    <span class="icon is-left">
                    <i class="fas fa-search" aria-hidden="true"></i>
                    </span>
                </p>
            {/if}
            </div>
    </div>
  </div>