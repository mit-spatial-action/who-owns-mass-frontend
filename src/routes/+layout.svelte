<script lang="ts">
    import type { LayoutProps } from "./$types";
    import siteConfig from "$lib/config/site.json";
    import "$lib/styles/styles.scss";
    import InfoPanel from "$lib/components/InfoPanel.svelte";
    import Map from "$lib/components/Map.svelte";
    import Dashboard from "$lib/components/Dashboard.svelte";

    import { navigating } from "$app/state";
    import SpinnerModal from "$lib/components/SpinnerModal.svelte";
    import { appState } from "$lib/state.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";
    import Navbar from "$lib/components/Navbar.svelte";

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

{#if navigating.from || appState.loading}
    <SpinnerModal />
{/if}
<Dashboard>
    <!-- <Sidebar /> -->
    <!-- <Navbar /> -->
    <InfoPanel>
        {@render children()}
    </InfoPanel>
    <Map />
</Dashboard>