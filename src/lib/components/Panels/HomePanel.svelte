<script lang="ts">
    import ForwardGeocoder from "$lib/components/Map/Geocoders/ForwardGeocoder.svelte";
    import PanelTitle from "$lib/components/Panels/PanelTitle.svelte";
    /** @type {import('./$types').PageData} */

    export let title: string = "Title";
    export let subtitle: string = "Longer description";

</script>

<div id="home-panel" class="home-panel p-5 columns  is-vcentered">
    <div class="column">
        <div class="has-text-centered">
        <PanelTitle>{title}</PanelTitle>
        <div
            class="subtitle mt-1 has-text-dark is-size-6 m-6 px-6"
        >
            {subtitle}
        </div>
        </div>
    <div class="centered">
        <ForwardGeocoder />
    </div>
    </div>
</div>

<style>
    #home-panel {
        height: 500px;
    }
</style>