<script lang="ts">
	import MetaCorpPanel from "$lib/components/Panels/MetaCorpPanel.svelte";
	import { site, metacorp, homeState } from "$lib/stores";
    import { slide } from 'svelte/transition';
	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
	$effect(() => {
		if (data.metaCorpData) {
			metacorp.set(data.metaCorpData);
			site.set(null);
			homeState.set(false);
		}
	});	
</script>

<div transition:slide={{duration:250, axis:'y'}}>
	<MetaCorpPanel metacorp={data.metaCorpData}/>
</div>