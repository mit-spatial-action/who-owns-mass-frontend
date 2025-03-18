<script>
    import GeocoderSearch from "$lib/components/Search/GeocoderSearch.svelte";
    import OwnerSearch from "$lib/components/Search/OwnerSearch.svelte";
    import Searchbar from "$lib/components/Search/Searchbar.svelte";
    import Suggestions from "$lib/components/Search/Suggestions.svelte";

    const searchModes = [
        {
            displayName: "Address",
            id: "address",
            color: "primary"
        },
        {
            displayName: "Owner",
            id: "owner", 
            color: "success"
        }
    ]

    let suggestions = $state([]);
    const initActive = searchModes[0];
    let hover = $state(initActive);
    let active = $state(initActive);

    const setHover = (mode) => {
        hover = mode;
    }
    const setActive = (mode) => {
        active = mode;
        suggestions= [];
    }

</script>

<div class="panel is-{active.color} border-{active.color}">
    <div class="panel-heading is-size-7 is-size-6-tablet">Search for an Address or Owner</div>
    <div class="panel-tabs is-size-7 is-size-6-tablet">
        {#each searchModes as mode}
            <a 
            class:is-active={mode.id === hover.id} 
            onmouseenter={() => setHover(mode)}
            onmouseleave={() => setHover(active)}
            onclick ={() => setActive(mode)}
            >{mode.displayName}</a>
        {/each}
    </div>
    <div class="panel-block is-flex is-justify-content-center">
        {#if active.id==="address"}
            <Searchbar mode={active.displayName} color={active.color}/>
            <GeocoderSearch bind:suggestions />
        {:else}
            <Searchbar mode={active.displayName} color={active.color}/>
            <OwnerSearch bind:suggestions />
        {/if}
    </div>
    <div class="panel-block">
        <Suggestions bind:suggestions/>
    </div>
  </div>