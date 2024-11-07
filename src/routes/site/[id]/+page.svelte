<script lang="ts">
	import SitePanel from "$lib/components/Panels/SitePanel.svelte";
	import { site } from "$lib/scripts/stores";
  	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
	if (data.siteData) {
		site.set(data.siteData);
	}
</script>

<SitePanel site={data.siteData.properties} />