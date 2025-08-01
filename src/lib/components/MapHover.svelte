<script>
    import { fly } from 'svelte/transition'
    let { address = null, muni = null} = $props()

</script>

<div class="mapboxgl-ctrl box"
  transition:fly={{ duration: 150, y: -300}}>
    <p><strong>{#if address}{address}{/if}</strong></p>
    <p>{#if muni}{muni}, MA{/if}</p>
</div>

<style lang="scss">
    @use "../styles/variables";
    .mapboxgl-ctrl {
        border-radius: 0;
        border: 0.4rem solid variables.$success;
    }
</style>