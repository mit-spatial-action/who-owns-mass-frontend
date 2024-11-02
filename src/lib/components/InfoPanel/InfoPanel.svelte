<script>
    /** @type {import('./$types').PageData} */
    import NavButton from "$lib/components/InfoPanel/NavButton.svelte";
    import HL from "$lib/components/InfoPanel/HL.svelte";
    import { getMetaCorp, getSite, metacorp, site, infoMode } from "$lib/scripts/stores.js";
</script>


<div class="has-text-left column p-5">
    <NavButton />
    {#if $infoMode === "site" }
        <div class="is-uppercase title has-text-dark is-size-1 mt-1 has-text-left block">
            {$site.properties.address.addr}
        </div>
        <div class="subtitle has-text-dark is-size-5 mt-1 has-text-left block">
            {$site.properties.address.muni}, {$site.properties.address.state}
        </div>
        <div class="has-text-dark is-size-5 mt-1 has-text-left block box">
            <div class="has-text-weight-bold">Owner(s)</div>
            {#each $site.properties.owners as owner, index}
                { index == $site.properties.owners.length-1 ? owner.properties.name : `${owner.properties.name}, `}
            {/each}
            <div class="block is-size-6 my-2 has-text-gray">
                {#if $site.properties.metacorp.prop_count > 1}
                        <p>This owner may own <HL>{$site.properties.metacorp.prop_count}</HL> properties, including <HL>{$site.properties.metacorp.unit_count}</HL> units.</p>
                        <button class="button is-ghost has-shadow mt-2" on:click={$getMetaCorp($site.properties.metacorp.id)}>See Details</button>
                {:else}
                        <p>We couldn't find any additional properties held by this owner.</p>
                {/if}
            </div>
        </div>
        <div class="box">
            <div class="columns">
                <div class="column mr-1">
                    <div class="has-text-weight-bold">Year of Record</div>
                    {#if $site.properties.fy}{$site.properties.fy}{:else}Unknown.{/if}
                </div>
                <div class="column mr-1">
                    <div class="has-text-weight-bold">Estimated Units</div>
                    {#if $site.properties.units}{$site.properties.units}{:else}Unknown.{/if}
                </div>
            </div>
            <div class="columns">
                <div class="column mr-1">
                    <div class="has-text-weight-bold">Last Sale Date</div>
                    {#if $site.properties.ls_date}{new Date($site.properties.ls_date).toLocaleDateString()}{:else}Unknown.{/if}
                </div>
                <div class="column mr-1">
                    <div class="has-text-weight-bold">Last Sale Price</div>
                    {#if $site.properties.ls_price}${$site.properties.ls_price.toLocaleString()}{:else}Unknown.{/if}
                </div>
            </div>
        </div>
    
    {:else if $infoMode === "metaCorp"}
        <div class="is-uppercase title has-text-dark is-size-1 mt-1 has-text-left block">
            {$metacorp.name}
        </div>

        <div class="box">
            <div class="columns">
                <div class="column mr-1">
                    <div class="has-text-weight-bold">Units Owned</div>
                    {#if $metacorp.unit_count}{$metacorp.unit_count}{:else}Unknown.{/if}
                </div>
                <div class="column mr-1">
                    <div class="has-text-weight-bold">Properties Owned</div>
                    {#if $metacorp.prop_count}{$metacorp.prop_count}{:else}Unknown.{/if}
                </div>
            </div>
            <div class="columns">
                <div class="column mr-1">
                    <div class="has-text-weight-bold">Total Assessed Value</div>
                    {#if $metacorp.val}${$metacorp.val.toLocaleString()}{:else}Unknown.{/if}
                </div>
            </div>
        </div>
        <div class="box" style="max-height: 300px; overflow-y: auto;">
            <div class="has-text-weight-bold">Properties</div>
            {#each $metacorp.sites.features as site}
                <div class="box">
                    <div><a class="has-text-weight-bold" on:click={$getSite(site.id)}>{site.properties.address.addr}</a></div>
                    <div>{#if site.properties.address.muni}{site.properties.address.muni}, {/if}{#if site.properties.address.state}{site.properties.address.state} {/if}{#if site.properties.address.postal}{site.properties.address.postal}{/if}</div>
                </div>
            {/each}
        </div>
        <div class="box mb-3" style="max-height: 300px; overflow-y: auto;">
            <div class="has-text-weight-bold">Other Names</div>
            {#each $metacorp.aliases as alias, index}
                { index == $metacorp.aliases.length-1 ? alias : `${alias}, `}
            {/each}
        </div>
    {/if}
    
</div>
<style>
    .has-shadow {
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Adjust the values as needed */
    }

</style>