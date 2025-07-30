<script lang="ts">
    import type { LayoutProps } from "./$types";
    import siteConfig from "$lib/config/site.json";
    import "$lib/styles/styles.scss";
    import InfoPanel from "$lib/components/InfoPanel.svelte";
    import Map from "$lib/components/Map.svelte";


    import { navigating } from "$app/state";
    import SpinnerModal from "$lib/components/SpinnerModal.svelte";
    import { appState } from "$lib/state.svelte";

    import "@fontsource-variable/manrope";

    import { page } from "$app/state";
    let { children }: LayoutProps = $props();
</script>

<svelte:head>
    <title
        >{page.data?.seo?.title
            ? [page.data.seo.title, siteConfig.title].join(" | ")
            : siteConfig.title}</title
    >
    <meta
        name="description"
        content={page.data?.seo?.description || siteConfig.description}
    />
</svelte:head>

<section class="hero is-fullheight">
    <div class="hero-body p-0">
        <div id="panels" class="columns">
            <InfoPanel>
                {@render children()}
            </InfoPanel>
            <Map />
            {#if navigating.from || appState.loading}
                <SpinnerModal />
            {/if}
        </div>
    </div>
</section>

<style>
    #panels {
        height: 100vh;
        width: 100%;
    }
</style>
