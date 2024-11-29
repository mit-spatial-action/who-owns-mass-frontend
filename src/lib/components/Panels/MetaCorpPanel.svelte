<script lang="ts">
    import HL from "$lib/components/Panels/HL.svelte";
    import PanelTitle from "$lib/components/Panels/PanelTitle.svelte";
    import {
        highlighted
    } from "$lib/stores";
    export let metacorp;
</script>


<header class="card-header is-shadowless">
    <PanelTitle> {metacorp.name}</PanelTitle>
</header>
<div class="card-content">
    <div class="fixed-grid">
        <div class="grid">
            <div class="cell">
                <div class="card">
                    <div class="card-content">
                        <div class="has-text-weight-bold">Units Owned</div>
                        {#if metacorp.unit_count}
                            {metacorp.unit_count}
                        {:else}
                            Unknown.
                        {/if}
                    </div>
                </div>
            </div>
            <div class="cell">
                <div class="card">
                    <div class="card-content">
                        <div class="has-text-weight-bold">Properties Owned</div>
                        {#if metacorp.prop_count}
                            {metacorp.prop_count}
                        {:else}
                            Unknown.
                        {/if}
                    </div>
                </div>
            </div>
            <div class="cell">
                <div class="card">
                    <div class="card-content">
                        <div class="has-text-weight-bold">Total Assessed Value</div>
                        {#if metacorp.val}
                            ${metacorp.val.toLocaleString()}
                        {:else}
                            Unknown.
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="card-content">
    <div class="title">Properties</div>
    <div class="fixed-grid has-1-cols has-2-cols-tablet">
        <div class="grid">
        {#each metacorp.sites.features.slice(0, 3) as site}
            <div class="cell">
                <a class="card button is-fullwidth has-text-left is-justify-content-left" 
                aria-label="Select Property {site.properties.address}" tabindex="0" data-sveltekit-preload-data="off" href={`/site/${site.id}`}
                on:mouseover={() => highlighted.set(site.id)} on:focus={() => highlighted.set(site.id)} on:mouseleave={() => highlighted.set(null)}>
                    <!-- <div class="card"> -->
                        <div class="card-content px-0">
                            <div class="has-text-weight-bold">{site.properties.address.addr}</div>
                            <div>{#if site.properties.address.muni}{`${site.properties.address.muni}, `}{/if}{#if site.properties.address.state}{`${site.properties.address.state} `} {/if}{#if site.properties.address.postal}{site.properties.address.postal}{/if}</div>
                        </div>
                    <!-- </div> -->
                </a>
            </div>
        {/each}
        </div>
    </div>
    {#if metacorp.sites.features.length > 3}
    <button class="button mt-2" data-sveltekit-preload-data="off" aria-label="See all Properties">
        See All {metacorp.sites.features.length} Properties &#8594
    </button>
    {/if}
</div>
<div class="card-content">
    <div class="title">Other Names</div>
        <div class="card">
            <div class="card-content">
                {#each metacorp.aliases as alias, index}
                    { index == metacorp.aliases.length-1 ? alias : `${alias}, `}
                {/each}
            </div>
    </div>
</div>