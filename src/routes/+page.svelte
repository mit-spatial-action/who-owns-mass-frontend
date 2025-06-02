<script lang="ts">
    import HomePanel from "$lib/components/Panels/HomePanel.svelte";
    import siteConfig from "$lib/config/site.json";
	import { site, metacorp, homeState } from "$lib/stores";

    /** @type {import('./$types').PageData} */
    $effect(() => {
        site.set(null);
        metacorp.set(null);
        homeState.set(true);
    })

</script>

<HomePanel
    title={siteConfig.title}
    subtitle={siteConfig.description}/>
