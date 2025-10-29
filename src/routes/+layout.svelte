<script lang="ts">
    import type { LayoutProps } from "./$types";
    import siteConfig from "$lib/config/site.json";
    import "$lib/styles/styles.scss";
    import InfoPanel from "$lib/components/InfoPanel.svelte";
    import Map from "$lib/components/Map.svelte";
    import Dashboard from "$lib/components/Dashboard.svelte";

    import { navigating } from "$app/state";
    import Searchbar from "$lib/components/Searchbar.svelte";
    import SpinnerModal from "$lib/components/SpinnerModal.svelte";
    import { appState } from "$lib/state.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";

    import { draggable } from '@neodrag/svelte';
    import type { DragOptions } from '@neodrag/svelte';
    import "@fontsource-variable/manrope";

    import { page } from "$app/state";
    
    let { children }: LayoutProps = $props();

    let options: DragOptions = {
        axis: 'y'
    };

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
    <Sidebar />
    <InfoPanel>
        <Searchbar />
        <div class="draggable" use:draggable={options}>
            <nav class="navbar">
                <div class="navbar-menu">
                    <div class="navbar-start">
                        <div class="navbar-item">
                            <button class="button">
                                <span class="icon">
                                    <i class="fa-solid fa-angle-down"></i>
                                </span>
                            </button>
                        </div>
                        <div class="navbar-item">
                            <button class="button">
                                <span class="icon">
                                    <i class="fa-solid fa-magnifying-glass"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                    <div class="navbar-end">
                    </div>
                </div>
            </nav>
            <!-- <button class="button dragger is-fullwidth">
                <span class="icon is-large">
                    <i class="fa-solid fa-minus"></i>
                </span>
            </button> -->
            {@render children()}
        </div>
    </InfoPanel>
    <Map />
</Dashboard>

<style>
    .draggable {
        /* height: 50vh; */
        overflow: auto;
        margin-top: 50vh;
        position: sticky;
        top: 50vh;
    }
</style>
