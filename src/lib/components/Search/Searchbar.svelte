<script lang="ts">
    import { geocoder } from "$lib/scripts/utils";
    import Suggestions from "$lib/components/Search/Suggestions.svelte";
    let { mode, color } = $props();
    import { onMount } from "svelte";
    import mapbox from "mapbox-gl";

    let suggestions = $state([]);
    let loading = $state(false);

    const buildResults = (results) => {
        results = results.map((r) => {
            return {
                text: `${r.address} ${r.text}`,
                location: `${r.context.filter((c) => c.id.split(".").shift() === "place")[0].text}, MA`,
                lngLat: new mapbox.LngLat(r.center[0], r.center[1]),
                address: `${r.address} ${r.text}`,
            };
        });
        return results;
    };

    const buildOwnerResults = (results) => {
        results = results.map((r) => {
            return {
                text: `${r.name}`,
                metacorp: `${r.metacorp}`,
            };
        });
        return results;
    };

    onMount(() => {
        const searchInput = document.getElementById(
            "search-input",
        ) as HTMLInputElement;

        let timeout: ReturnType<typeof setTimeout>;

        if (mode == "address") geocoder.addTo(searchInput);

        searchInput.addEventListener("input", (e) => {
            clearTimeout(timeout);
            loading = true;
            timeout = setTimeout(async () => {
                const query = searchInput.value.trim();

                if (query.length > 1) {
                    if (mode == "address") {
                        geocoder.query(query);
                    } else if (mode == "owner") {
                        try {
                            suggestions = await fetch(
                                `/queries/suggestions?query=${encodeURIComponent(query)}`,
                            )
                                .then((response) => response.json())
                                .then((json) =>
                                    buildOwnerResults(json.suggestions.results),
                                );
                        } catch (error) {
                            console.error("API Error:", error);
                        }
                    }
                    loading = false;
                }
            }, 350);
        });

        geocoder.on("results", (e) => {
            suggestions = buildResults(e.features);
        });
    });
</script>

<div class="field has-addons is-fullwidth">
    <p id="searchbar" class={`control is-expanded ${loading ? "is-loading" : ""}`}>
        <input id="search-input" class="input" type="text" placeholder="Search by {mode}" />
    </p>
    <p class="control">
        <span class="select">
            <select>
                <option>Address</option>
                <option>Owner</option>
            </select>
        </span>
    </p>
</div>
<Suggestions {suggestions} />
