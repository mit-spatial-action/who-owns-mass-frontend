<script>
    import { fly } from 'svelte/transition'
    let { address = null, muni = null} = $props()

</script>

<div class="mapboxgl-ctrl box"
  transition:fly={{ duration: 150, y: -300}}>
    {#if address}<p><strong>{address}</strong></p>{/if}
    {#if muni} <p>{muni}, MA</p>{/if}
</div>

<style lang="scss">
    @use "../styles/variables";
    .mapboxgl-ctrl.box {
        border-radius: 0;
        border: 0.4rem solid variables.$success;
        margin: 0;
    }
</style>