<script lang="ts">
    import HomePanel from "$lib/components/Panels/HomePanel.svelte";
    import site_data from "$lib/config/instance.json";
    import "$lib/styles/style.css";
	import { site, metacorp, homeState } from "$lib/stores";

    /** @type {import('./$types').PageData} */
    $effect(() => {
        site.set({});
        metacorp.set({});
        homeState.set(true);
    })

</script>


<HomePanel
    title={site_data.title}
    subtitle={site_data.description}/>
