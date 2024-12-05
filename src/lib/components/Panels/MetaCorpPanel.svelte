<script lang="ts">
    import HL from "$lib/components/Panels/HL.svelte";
    import PanelTitle from "$lib/components/Panels/PanelTitle.svelte";
    import {
        highlighted
    } from "$lib/stores";
    import IconCard from "$lib/components/Panels/Cards/IconCard.svelte";
    import CardHeader from "$lib/components/Panels/Cards/CardHeader.svelte";
    import CardContent from "$lib/components/Panels/Cards/CardContent.svelte";
    export let metacorp;
</script>


<CardHeader color="primary">{metacorp.name}</CardHeader>

<CardContent>
    <div class="box p-0 is-shadowless">
        <div class="fixed-grid">
            <div class="grid">
                <div class="cell">
                    <IconCard title="Units" icon="building">
                        {#if metacorp.unit_count}
                            {metacorp.unit_count}
                        {:else}
                            Unknown.
                        {/if}
                    </IconCard>
                </div>
                <div class="cell">
                    <IconCard title="Properties" icon="city">
                        {#if metacorp.prop_count}
                            {metacorp.prop_count}
                        {:else}
                            Unknown.
                        {/if}
                    </IconCard>
                </div>
                <div class="cell">
                    <IconCard title="Total Valuation" icon="dollar-sign">
                        {#if metacorp.val}
                            ${metacorp.val.toLocaleString()}
                        {:else}
                            Unknown.
                        {/if}
                    </IconCard>
                </div>
            </div>
        </div>
    </div>
    <div class="title">Properties</div>
    <div class="fixed-grid">
        <div class="grid">
        {#each metacorp.sites.features.slice(0, 4) as site}
            <div class="cell">
                <div class="card border-primary is-shadowless" 
                aria-label="Select {site.properties.address}" tabindex="0" data-sveltekit-preload-data="off"
                on:mouseover={() => highlighted.set(site.id)} on:focus={() => highlighted.set(site.id)} on:mouseleave={() => highlighted.set(null)}>
                    <div class="card-content">
                        <a href={`/site/${site.id}`} class="has-text-dark">
                        <div class="has-text-weight-bold">{site.properties.address.addr}</div>
                        <div>{#if site.properties.address.muni}{`${site.properties.address.muni}, `}{/if}{#if site.properties.address.state}{`${site.properties.address.state} `} {/if}{#if site.properties.address.postal}{site.properties.address.postal}{/if}</div>
                        </a>
                    </div>
                </div>
            </div>
        {/each}
        </div>
    </div>
    {#if metacorp.sites.features.length > 4}
    <div class="block buttons is-right">
        <button class="button border-primary" data-sveltekit-preload-data="off" aria-label="See all Properties">
            See All {metacorp.sites.features.length} Properties &#8594
        </button>
    </div>
    {/if}
    <div class="title">Other Names</div>
        <div class="card border-primary">
            <div class="card-content">
                {#each metacorp.aliases as alias, index}
                    { index == metacorp.aliases.length-1 ? alias : `${alias}, `}
                {/each}
            </div>
    </div>
</CardContent>


<style>
    .box {
        border-radius: 0;
    }
</style>