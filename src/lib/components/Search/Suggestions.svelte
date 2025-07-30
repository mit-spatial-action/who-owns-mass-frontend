<script lang="ts">
    import { goto } from "$app/navigation";
    import { appState } from "$lib/state.svelte";
    import mapConfig from "$lib/config/map.json";
    import type { LngLat } from "mapbox-gl";
    import ErrorMessage from "$lib/components/ErrorMessage.svelte";

    import { slide } from 'svelte/transition';
    let { suggestions } = $props();

    let error = $state("");

    const mapMatch = async (address) => {
        let resultSiteId: string | number;
        appState.map.once('idle', async () => {
            let features = appState.map.queryRenderedFeatures({
                layers: ["sites"],
            });
            if (features.length > 0) {
                let selected = features.filter(
                    feature => feature.properties.addr.toUpperCase() === address.toUpperCase())
                if (selected.length > 0) {
                    goto('site/' + selected[0].properties.site_id);
                } else {
                    appState.loading = false;
                    error = "addressNotFound";
                }
            }
            return resultSiteId
        })
    }

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

    const handleClick = (suggestion) => {
        (document.getElementById('searchbar') as HTMLInputElement).value = suggestion.text
        suggestions = [];
        if(suggestion.lngLat){
            appState.loading = true;
            mapMatch(suggestion.address);
            flyToLngLat(suggestion.lngLat);
            
        } else if (suggestion.metacorp){
            appState.loading = true;
            goto(`/meta/${suggestion.metacorp}`);
        }
    }
</script>

<div class="panel-block">
    <div class="menu">
        <ul class="menu-list">
        {#each suggestions as suggestion }
            <li>
            <button transition:slide={{duration:250, axis:'y'}} class="button px-2 py-1 is-small is-responsive"
            onclick={() => handleClick(suggestion)}>
                <span class="icon">
                    <i class="fa-solid fa-address-book"></i>
                </span>
                <span>
                    {#if suggestion.location}
                        {suggestion.text}, {suggestion.location}
                    {:else}
                        {suggestion.text}
                    {/if}
                </span>
            </button>
            </li>
        {/each}
        </ul>
    </div>
</div>

{#if error}
    <div class="panel-block">
        <ErrorMessage {error} />
    </div>
{/if}

<style>
    .menu {
        overflow: hidden;
    }
</style>