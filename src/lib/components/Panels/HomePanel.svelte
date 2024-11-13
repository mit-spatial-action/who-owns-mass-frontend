<script>
    import { afterUpdate, onMount } from "svelte";
    import ForwardGeocoder from "$lib/components/Map/Geocoders/ForwardGeocoder.svelte";
    import PanelTitle from "$lib/components/Panels/PanelTitle.svelte";
    /** @type {import('./$types').PageData} */

    export let title = "Title";
    export let subtitle = "Longer description";

    // afterUpdate(() => {
    //     if (document.getElementById("geocoder")) {
    //         let length = document.getElementById("geocoder").children.length;

    //         if (length == 0) {
    //             remountSearchbar.update((n) => n + 1);
    //         }
    //     }
    // });

</script>

<div id="home-panel mt-6">
    <div class="card-content mt-6">
        <div class="title is-size-1 has-text-centered">
            {title}
        </div>
        <div class="block has-text-centered">
            {subtitle}
        </div>
        <div class="block is-flex has-content-centered is-justify-content-center">
            <ForwardGeocoder />
        </div>
        <div class="block has-text-centered mt-6">
            <p class="has-text-grey-light">A project of the <a href="https://mit-spatial-action.github.io/">MIT Spatial Analysis & Action Research Group</a>. Built in partnership with the <a href="https://hns.mit.edu/">Healthy Neighborhoods Study</a>, the <a href="https://www.clf.org/">Conservation Law Foundation</a>, and the <a href="https://www.mapc.org/">Metropolitan Area Planning Council</a>.</p>
        </div>
    </div>
</div>