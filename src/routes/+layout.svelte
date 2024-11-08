<script lang="ts">
    import site_data from '$lib/config/instance.json';
    import "$lib/styles/style.css";
    import InfoPanel from "$lib/components/Panels/InfoPanel.svelte";
    import Map from "$lib/components/Map/Map.svelte";
    import RippleLoader from "$lib/components/RippleLoader.svelte";
    import Panel from "$lib/components/Panels/Panel.svelte";

    import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';

</script>
<title>{site_data.title}</title>
<link rel="icon" type="image/x-icon" href={site_data.favicon}>

<div id="homepage">
    <RippleLoader />
    <div id="panels" class="columns">
    <InfoPanel>
        <slot />
    </InfoPanel>
    <Panel>
        {#if PUBLIC_MAPBOX_TOKEN }
        <Map 
            mapbox_token={PUBLIC_MAPBOX_TOKEN}
            projection={site_data.map.projection}
            style={site_data.map.style}
            />
        {/if}
    </Panel>
    </div>
</div>


<style>

#homepage {
    height: 100vh;
    color: #444;
}

#panels {
    height: inherit;
    display: flex;
}
</style>