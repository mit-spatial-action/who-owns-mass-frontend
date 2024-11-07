<script lang="ts">
    import HomePanel from "$lib/components/Panels/HomePanel.svelte";
    import site_data from "$lib/config/instance.json";
    import "$lib/styles/style.css";
	import { site, metacorp } from "$lib/scripts/stores";

    /** @type {import('./$types').PageData} */
    site.set({})
    metacorp.set({})

</script>


<HomePanel
    title={site_data.title}
    subtitle={site_data.description}/>
