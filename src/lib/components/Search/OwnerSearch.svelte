<script lang="ts">
    import { onMount, onDestroy } from 'svelte';

    export let suggestions = [];

    export let loading = false;

    const buildResults = (results) => {
        results = results.map((r) => {
            return {
                text: `${r.name}`, 
                metacorp: `${r.metacorp}`,
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
                    loading = true;

                    try {
                        const response = await fetch(`/queries/suggestions?query=${encodeURIComponent(query)}`);
                        const results = await response.json();
                       suggestions = buildResults(results.suggestions.results);
                    } catch (error) {
                        console.error("API Error:", error);
                    } finally {
                        loading = false;
                    }
                } else {
                    suggestions = [];
                }
            }, 200); 
        });
     }
    });

    
</script>