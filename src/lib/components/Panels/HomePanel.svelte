<script>
    import { afterUpdate, onMount } from "svelte";
    import ForwardGeocoder from "$lib/components/Map/Geocoders/ForwardGeocoder.svelte";
    import Panel from "$lib/components/Panels/Panel.svelte";

    /** @type {import('./$types').PageData} */

    export let title = "Title";
    export let subtitle = "Longer description";

    // onMount(() => {
    //     loadState.set(true);
    // });

    // afterUpdate(() => {
    //     if (document.getElementById("geocoder")) {
    //         let length = document.getElementById("geocoder").children.length;

    //         if (length == 0) {
    //             remountSearchbar.update((n) => n + 1);
    //         }
    //     }
    // });

</script>
<Panel>
    <div class="home-panel p-5">
        <div class="title has-text-dark is-size-1 has-text-centered">
            {title}
        </div>
        <div
            class="subtitle mt-1 has-text-dark is-size-6 has-text-centered m-6 px-6"
        >
            {subtitle}
        </div>
        <div class="centered">
            <ForwardGeocoder />
        </div>
    </div>
</Panel>