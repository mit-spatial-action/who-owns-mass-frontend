<script lang="ts">
	import type { PageProps } from './$types';
	import SitePanel from "$lib/components/Panels/SitePanel.svelte";
	import { site, metacorp, homeState } from "$lib/stores";
    import { slide } from 'svelte/transition';

	let { data }: PageProps = $props();
	
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