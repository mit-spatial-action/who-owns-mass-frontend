<script lang="ts">
	import SitePanel from "$lib/components/Panels/SitePanel.svelte";
	import { site, metacorp, homeState } from "$lib/stores";
  	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
	$effect(() => {
		if (data.siteData) {
			site.set(data.siteData);
			metacorp.set({});
			homeState.set(false);
		}
	});
</script>

<SitePanel site={data.siteData.properties} />