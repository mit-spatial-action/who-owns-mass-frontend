<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { getFromApi } from "$lib/scripts/utils";
    import { API_TOKEN } from '$env/static/private';


    let ownerSearch;
    export let suggestions = [];

    // Need to revise based on owner API output
    const buildResults = (results) => {
        results = results.map((r) => {
            return {
                text: `${r.address} ${r.text}`, 
                location: `${r.context.filter(c => c.id.split('.').shift() === 'place')[0].text}, MA`,
            }
        })
        return results
    }

    onMount(()=>{

        const searchInput = document.getElementById('search-input') as HTMLInputElement;
        let timeout: ReturnType<typeof setTimeout>;

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
            clearTimeout(timeout);
            
            timeout = setTimeout(async () => {
                const query = searchInput.value.trim(); 
                
                if (query.length > 0) {
                    try {
                        const results = await getFromApi(fetch, '/api', API_TOKEN, 'owners', query); //How to get API token for search?
                        console.log(results);
                       //suggestions = buildResults(results.features);
                       suggestions = [];
                    } catch (error) {
                        console.error("API Error:", error);
                    }
                } else {
                    suggestions = [];
                }
            }, 300); 
        });
     }
    });

    onDestroy(()=>{
        if (geocoder && geocoder.parentNode ) {
            geocoder.onRemove();
        }
    });
    
</script>