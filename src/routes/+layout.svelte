<script lang="ts">
    import siteConfig from '$lib/config/site.json';
    import "$lib/styles/style.css";
    import InfoPanel from "$lib/components/Panels/InfoPanel.svelte";
    import Map from "$lib/components/Map/Map.svelte";
    import RippleLoader from "$lib/components/RippleLoader.svelte";
    // import Modal from "$lib/components/Modal.svelte";
    import MapPanel from "$lib/components/Panels/MapPanel.svelte";

    import { loadState } from "$lib/stores";
    
</script>
<title>{siteConfig.title}</title>
<link rel="icon" type="image/x-icon" href={siteConfig.favicon}>
<section class="hero is-fullheight">
    <div class="hero-body p-0">
        {#if $loadState}
            <RippleLoader />
        {/if}
        <div id="panels" class="columns has-background-light">
            <!-- <Modal >
                <slot name="modal-content" />
            </Modal> -->
            <InfoPanel>
                <slot />
            </InfoPanel>
            <MapPanel/>
        </div>
    </div>
</section>


<style lang="scss">

#panels {
    height: 100vh;
    width: 100%;
}
</style>