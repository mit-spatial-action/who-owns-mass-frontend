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
        <p class="has-text-grey-light has-text-centered subtitle mt-1 has-text-dark is-size-6 m-6 px-6">A project of the <a href="https://mit-spatial-action.github.io/">MIT Spatial Analysis & Action Research Group</a>. Built in partnership with the <a href="https://hns.mit.edu/">Healthy Neighborhoods Study</a>, the <a href="https://www.clf.org/">Conservation Law Foundation</a>, and the <a href="https://www.mapc.org/">Metropolitan Area Planning Council</a>.</p>
    </div>
    </div>
</div>

<style>
    #home-panel {
        height: 500px;
    }
</style>