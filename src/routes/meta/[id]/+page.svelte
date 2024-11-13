<script lang="ts">
	import MetaCorpPanel from "$lib/components/Panels/MetaCorpPanel.svelte";
	import { site, metacorp, homeState } from "$lib/stores";
	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
	$effect(() => {
		if (data.metaCorpData) {
			metacorp.set(data.metaCorpData);
			site.set({});
			homeState.set(false);
		}
	});	
</script>

<MetaCorpPanel metacorp={data.metaCorpData}/>