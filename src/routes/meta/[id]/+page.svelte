<script>
	import MetaCorpPanel from "$lib/components/Panels/MetaCorpPanel.svelte";
	import { metacorp } from "$lib/scripts/stores.js";
	import { page } from '$app/stores';
	
	$: metaCorpData = $page.data.metaCorpData;
	$: if (metaCorpData) {
		metacorp.set(metaCorpData);
	}
</script>
<MetaCorpPanel metacorp={metaCorpData}/>