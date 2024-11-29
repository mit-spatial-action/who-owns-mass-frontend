<script lang="ts">
	import SitePanel from "$lib/components/Panels/SitePanel.svelte";
	import { site, metacorp, homeState } from "$lib/stores";
    import { slide } from 'svelte/transition';
  	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
	$effect(() => {
		if (data.siteData) {
			site.set(data.siteData);
			metacorp.set(null);
			homeState.set(false);
		}
	});
</script>

<div transition:slide={{duration:250, axis:'y'}}>
	<SitePanel site={data.siteData.properties} />
</div>