<script lang="ts">
    import Map from "$lib/components/Map/Map.svelte";
    import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';
</script>

<div id="mappanel" class="column">
    {#if PUBLIC_MAPBOX_TOKEN }
    <Map 
        mapboxToken={PUBLIC_MAPBOX_TOKEN}
        />
    {/if}
</div>

<style lang="scss">
    @use 'src/lib/styles/vars.scss' as *;
    #mappanel {
        z-index: 0;
        // border: 0.125rem solid black;
    }
</style>