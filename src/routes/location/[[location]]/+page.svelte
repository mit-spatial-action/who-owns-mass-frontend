<script>
    import { selectedFeature, mapState } from '$lib/scripts/stores.js';
    import { get } from 'svelte/store'
    
	/** @type {import('./$types').PageData} */
	export let data;

    const updateFeature = (map, location) => {
        let filter = ['==', 'eviction_rank', parseInt(location)]
        let feature = map.querySourceFeatures('sample-evictions', {
            sourceLayer: 'Sample-Evictions',
            filter: filter
        });
        selectedFeature.set(feature);
    }
    
    $: get(mapState) && updateFeature(get(mapState), data.location);
    
</script>