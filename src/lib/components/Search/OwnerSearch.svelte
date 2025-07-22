<script lang="ts">
    import { onMount, onDestroy } from 'svelte';

    interface Props {
        suggestions?: any;
        loading?: boolean;
        noresult?: boolean;
    }

    let { suggestions = $bindable([]), loading = $bindable(false), noresult = $bindable(false) }: Props = $props();

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

                    noresult=false;

                    if (query.length > 1) {
                        loading = true;
                        try {
                            const response = await fetch(`/queries/suggestions?query=${encodeURIComponent(query)}`);
                            const results = await response.json();
                        suggestions = buildResults(results.suggestions.results);
                            if(suggestions.length == 0){
                                noresult = true;
                            }
                        } catch (error) {
                            console.error("API Error:", error);
                        } finally {
                            loading = false;
                        }
                    } else {
                        loading=false;
                        noresult=false
                        suggestions = [];
                    }
                }, 350); 
            });
        }
    });

    
</script>