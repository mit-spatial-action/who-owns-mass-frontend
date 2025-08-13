<script>
    import Searchbar from "$lib/components/Search/Searchbar.svelte";

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
    let active = $state(modes[0]);
</script>

<div class="panel is-{active.color} border-{active.color}">
    <div class="panel-heading is-size-7 is-size-6-tablet">Search for an Address or Owner</div>
    <Searchbar mode={active.id} color={active.color}/>
  </div>