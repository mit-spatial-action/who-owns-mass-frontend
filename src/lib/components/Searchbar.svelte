<script lang="ts">
    import { geocoder, toTitleCase } from "$lib/scripts/utils";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import mapbox from "mapbox-gl";
    import type { LngLat } from "mapbox-gl";
    import ErrorMessage from "$lib/components/ErrorMessage.svelte";
    import { appState } from "$lib/state.svelte.ts";

    import mapConfig from "$lib/config/map.json";

    const modes = [
        {
            id: "address",
            color: "primary",
        },
        {
            id: "owner",
            color: "success",
        },
    ];

    let suggestions = $state([]);
    let loading = $state(false);
    let mode = $state(modes[0]);
    let error = $state("");
    let input = $state("");

    const mapMatch = async (address) => {
        let resultSiteId: string | number;
        appState.map.once("idle", async () => {
            let features = appState.map.queryRenderedFeatures({
                layers: ["sites"],
            });
            if (features.length > 0) {
                let selected = features.filter(
                    (feature) =>
                        feature.properties.addr.toUpperCase() ===
                        address.toUpperCase(),
                );
                if (selected.length > 0) {
                    goto("/site/" + selected[0].properties.site_id);
                } else {
                    appState.loading = false;
                    error = "addressNotFound";
                }
            }
            return resultSiteId;
        });
    };

    const flyToLngLat = (
        lngLat: LngLat,
        zoom: number = mapConfig.resultZoom,
    ) => {
        appState.map.flyTo({
            center: lngLat,
            zoom: appState.map.getZoom() > zoom ? appState.map.getZoom() : zoom,
            duration: mapConfig.init.zoomDur,
            essential: true,
            bearing: -45,
            pitch: 45,
        });
    };

    const onclick = (suggestion) => {
        (document.getElementById("searchbar") as HTMLInputElement).value =
            suggestion.text;
        suggestions = [];
        if (suggestion.lngLat) {
            appState.loading = true;
            mapMatch(suggestion.address);
            flyToLngLat(suggestion.lngLat);
        } else if (suggestion.metacorp) {
            appState.loading = true;
            goto(`/metacorp/${suggestion.metacorp}`);
        }
    };

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

        if (mode.id == "address") geocoder.addTo(searchInput);

        searchInput.addEventListener("input", (e) => {
            clearTimeout(timeout);
            loading = true;
            timeout = setTimeout(async () => {
                const query = searchInput.value.trim();

                if (query.length >= 1) {
                    if (mode.id == "address") {
                        geocoder.query(query);
                    } else if (mode.id == "owner") {
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

<div class="panel is-{mode.color} border-{mode.color}">
    <div class="panel-heading is-size-6">Search for an Address or Owner</div>
    <div class="field has-addons is-fullwidth">
        <p class="control">
            <button aria-label="Open sidebar." class="button" onclick={() => (appState.sidebar = true)}>
                <span class="icon">
                    <i class="fas fa-bars"></i>
                </span>
            </button>
        </p>
        <p
            id="searchbar"
            class={`control is-expanded ${loading ? "is-loading" : ""}`}
        >
            <input
                id="search-input"
                class="input"
                type="text"
                bind:value={input}
                placeholder="Search by {toTitleCase(mode.id)}"
            />
        </p>
        <p class="control">
            <span class="select">
                <select bind:value={mode} onchange={() => (input = "")}>
                    {#each modes as m}
                        <option value={m}>{toTitleCase(m.id)}</option>
                    {/each}
                </select>
            </span>
        </p>
    </div>
    {#if suggestions.length > 0}
        {#each suggestions as suggestion}
            <a role="button" tabindex=0 href={"#"} class="panel-block" onclick={() => onclick(suggestion)}>
                <span class="panel-icon">
                    <i class="fas fa-address-book" aria-hidden="true"></i>
                </span>
                {#if suggestion.location}
                    {suggestion.text}, {suggestion.location}
                {:else}
                    {suggestion.text}
                {/if}
            </a>
        {/each}
    {/if}
</div>
{#if error}
    <ErrorMessage {error} />
{/if}

<style>
    .menu {
        width: 100%;
    }
</style>
