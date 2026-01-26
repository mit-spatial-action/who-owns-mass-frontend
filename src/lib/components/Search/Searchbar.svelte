<script lang="ts">
    import { geocoder } from "$lib/scripts/utils";
    import Suggestions from "$lib/components/Search/Suggestions.svelte";
    let { mode, color } = $props();
    import { onMount } from "svelte";
    import mapbox from "mapbox-gl";

    let suggestions = $state([])

    const buildResults = (results) => {
        results = results.map((r) => {
            return {
                text: `${r.address} ${r.text}`, 
                location: `${r.context.filter(c => c.id.split('.').shift() === 'place')[0].text}, MA`,
                lngLat: new mapbox.LngLat(r.center[0], r.center[1]),
                address: `${r.address} ${r.text}`
            }
        })
        return results
    }

    const buildOwnerResults = (results) => {
        results = results.map((r) => {
            return {
                text: `${r.name}`, 
                metacorp: `${r.metacorp}`,
            }
        })
        return results
    }


    onMount(() => {
        const searchInput = document.getElementById(
            "search-input",
        ) as HTMLInputElement;
        
        let timeout: ReturnType<typeof setTimeout>;
        
        if (mode=="address") geocoder.addTo(searchInput);
        
        searchInput.addEventListener("input", (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(async () => {
                
                const query = searchInput.value.trim();

                if (query.length > 1) {
                    if (mode=="address") {
                        geocoder.query(query);
                    } else if (mode=="owner") {
                        try {
                            const response = await fetch(`/api/owners?query=${encodeURIComponent(query)}`);
                            const data = await response.json();
                            suggestions = buildOwnerResults(data.suggestions.results);
                        } catch (error) {
                            console.error("API Error:", error);
                        }
                    }
                }
            }, 350);
        });

        geocoder.on('results', (e) => {
            suggestions = buildResults(e.features);
        });
    });
</script>

<div class="panel-block">
    <p id="searchbar" class="control has-icons-left">
        <input
            id="search-input"
            class="input is-{color}"
            type="text"
            placeholder="Search by {mode}"
        />
        <span class="icon is-left has-text-{color}">
            <i class="fas fa-search" aria-hidden="true"></i>
        </span>
    </p>
</div>
<Suggestions {suggestions} />