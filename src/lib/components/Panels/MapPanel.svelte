<script lang="ts">
    import Panel from "$lib/components/Panels/Panel.svelte";
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

<style>
    #mappanel {
        z-index: 0;
    }
</style>