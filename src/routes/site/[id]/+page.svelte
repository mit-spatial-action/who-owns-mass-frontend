<script>
	import SitePanel from "$lib/components/Panels/SitePanel.svelte";
	import { site } from "$lib/scripts/stores.js";
  	import { page } from '$app/stores';
	
	$: siteData = $page.data.siteData;
	$: if (siteData) {
		site.set(siteData);
	}
</script>
<SitePanel site={siteData.properties} />