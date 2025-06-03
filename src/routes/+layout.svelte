<script lang="ts">
    import siteConfig from '$lib/config/site.json';
    import "$lib/styles/styles.scss";
    import InfoPanel from "$lib/components/Panels/InfoPanel.svelte";
    import RippleLoader from "$lib/components/RippleLoader.svelte";
    import MapPanel from "$lib/components/Panels/MapPanel.svelte";

    import { loadState } from "$lib/stores";
    
    import "@fontsource-variable/manrope";

</script>
<title>{siteConfig.title}</title>
<section class="hero is-fullheight">
    <div class="hero-body p-0">
        {#if $loadState}
            <RippleLoader />
        {/if}
        <div id="panels" class="columns has-background-light">
            <InfoPanel>
                <slot />
            </InfoPanel>
            <MapPanel/>
        </div>
    </div>
</section>


<style>
#panels {
    height: 100vh;
    width: 100%;
}
</style>