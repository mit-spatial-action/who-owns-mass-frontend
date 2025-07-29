<script>
    import Searchbar from "$lib/components/Search/Searchbar.svelte";
    import { toTitleCase } from "$lib/scripts/utils";

    const modes = [
        {
            id: "address",
            color: "primary"
        },
        {
            id: "owner", 
            color: "success"
        }
    ]
    let hover = $state(modes[0]);
    let active = $state(modes[0]);
</script>

<div class="panel is-{active.color} border-{active.color}">
    <div class="panel-heading is-size-7 is-size-6-tablet">Search for an Address or Owner</div>
    <div class="panel-tabs is-size-7 is-size-6-tablet">
        {#each modes as mode}
            <a 
                role="button"
                href="#"
                tabindex=0
                class:is-active={mode.id === hover.id} 
                onmouseenter={() => hover = mode}
                onmouseleave={() => hover = active}
                onclick ={() => active = mode}
                onkeydown ={() => active = mode}>
                {toTitleCase(mode.id)}
            </a>
        {/each}
    </div>
    <Searchbar mode={active.id} color={active.color}/>
  </div>