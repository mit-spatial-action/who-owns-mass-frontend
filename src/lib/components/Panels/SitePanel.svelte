<script>
    import HL from "$lib/components/Panels/HL.svelte";
    import PanelTitle from "$lib/components/Panels/PanelTitle.svelte";
    
    export let site;

</script>


<div class="has-text-left">
    <PanelTitle>{site.address.addr}</PanelTitle>
    <div class="subtitle has-text-dark is-size-5 mt-1 has-text-left block">
        {site.address.muni}, {site.address.state}
    </div>
    <div class="has-text-dark is-size-5 mt-1 has-text-left block box">
        <div class="has-text-weight-bold">Owner(s)</div>
        {#each site.owners as owner, index}
            { index == site.owners.length-1 ? owner.properties.name : `${owner.properties.name}, `}
        {/each}
        <div class="block is-size-6 my-2 has-text-gray">
            {#if site.metacorp.prop_count > 1}
                    <p>This owner may own <HL>{site.metacorp.prop_count}</HL> properties, including <HL>{site.metacorp.unit_count}</HL> units.</p>
                    <a class="button is-ghost has-shadow mt-2" data-sveltekit-preload-data="off" href={`/meta/${site.metacorp.id}`}>See Details</a>
            {:else}
                    <p>We couldn't find any additional properties held by this owner.</p>
            {/if}
        </div>
    </div>
    <div class="box">
        <div class="columns">
            <div class="column mr-1">
                <div class="has-text-weight-bold">Year of Record</div>
                {#if site.fy}{site.fy}{:else}Unknown.{/if}
            </div>
            <div class="column mr-1">
                <div class="has-text-weight-bold">Estimated Units</div>
                {#if site.units}{site.units}{:else}Unknown.{/if}
            </div>
        </div>
        <div class="columns">
            <div class="column mr-1">
                <div class="has-text-weight-bold">Last Sale Date</div>
                {#if site.ls_date}{new Date(site.ls_date).toLocaleDateString()}{:else}Unknown.{/if}
            </div>
            <div class="column mr-1">
                <div class="has-text-weight-bold">Last Sale Price</div>
                {#if site.ls_price}${site.ls_price.toLocaleString()}{:else}Unknown.{/if}
            </div>
        </div>
    </div>
</div>

<style>
    .has-shadow {
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Adjust the values as needed */
    }

</style>