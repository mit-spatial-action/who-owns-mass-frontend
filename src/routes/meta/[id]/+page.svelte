<script>
	import MetaCorpPanel from "$lib/components/Panels/MetaCorpPanel.svelte";
	import { metacorp } from "$lib/scripts/stores.js";
	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	if (data.metaCorpData) {
		metacorp.set(data.metaCorpData);
	}
</script>
<MetaCorpPanel metacorp={data.metaCorpData}/>