<script lang="ts">
	import type { PageProps } from './$types';
	import MetaCorpPanel from "$lib/components/Panels/MetaCorpPanel.svelte";
	import { appState } from '$lib/state.svelte';
    import { slide } from 'svelte/transition';

	let { data }: PageProps = $props();

	$effect(() => {
		if (data.metaCorp) appState.metacorp = data.metaCorp;
	});	
</script>

<div transition:slide={{duration:250, axis:'y'}}>
	<MetaCorpPanel metacorp={data.metaCorp}/>
</div>