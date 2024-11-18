<script lang="ts">
    import siteConfig from '$lib/config/site.json';
    import "$lib/styles/style.css";
    import InfoPanel from "$lib/components/Panels/InfoPanel.svelte";
    import Map from "$lib/components/Map/Map.svelte";
    import RippleLoader from "$lib/components/RippleLoader.svelte";
    // import Modal from "$lib/components/Modal.svelte";
    import Panel from "$lib/components/Panels/Panel.svelte";

    import { loadState } from "$lib/stores";

    import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';

</script>
<title>{siteConfig.title}</title>
<link rel="icon" type="image/x-icon" href={siteConfig.favicon}>
<div id="homepage">
    {#if $loadState}
        <RippleLoader />
    {/if}
    <div id="panels" class="columns">
        <!-- <Modal >
            <slot name="modal-content" />
        </Modal> -->
        <InfoPanel>
            <slot />
        </InfoPanel>
        <Panel>
            {#if PUBLIC_MAPBOX_TOKEN }
            <Map 
                mapboxToken={PUBLIC_MAPBOX_TOKEN}
                />
            {/if}
        </Panel>
    </div>
</div>


<style lang="scss">

#homepage {
    height: 100vh;
    color: #444;
}

#panels {
    height: inherit;
    display: flex;
}
</style>