<script lang="ts">
	import type { PageProps } from './$types';
	import SitePanel from "$lib/components/Panels/SitePanel.svelte";
	import { appState } from '$lib/state.svelte';
    import { slide } from 'svelte/transition';

	let { data }: PageProps = $props();
	
	$effect(() => {
		if (data.site) appState.site = data.site;
	});
</script>

<div transition:slide={{duration:250, axis:'y'}}>
	<SitePanel site={data.site.properties} />
</div>