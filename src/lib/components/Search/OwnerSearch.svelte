<script lang="ts">
    import { onMount, onDestroy } from 'svelte';

    let ownerSearch;
    export let suggestions = [];

    // Need to revise based on owner API output
    const buildResults = (results) => {
        results = results.map((r) => {
            return {
                text: `${r.properties.name}`, 
                metacorp: `${r.properties.metacorp}`,
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
                        const response = await fetch(`/queries/suggestions?query=${encodeURIComponent(query)}`);
                        const results = await response.json();
                        console.log("RESULTS");
                        console.log(results);
                       suggestions = buildResults(results.suggestions.results.features);
                       console.log(suggestions);
                       //suggestions = [];
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

    
</script>