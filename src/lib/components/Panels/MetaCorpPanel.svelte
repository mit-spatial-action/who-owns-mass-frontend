<script>
    import Panel from "$lib/components/Panels/Panel.svelte";
    import NavButton from "$lib/components/Panels/NavButton.svelte";
    import HL from "$lib/components/Panels/HL.svelte";
    import { siteNav } from "$lib/scripts/utils";
    
    export let metacorp;

</script>


<Panel>
<div class="has-text-left column p-5">
    <NavButton />
    <div class="is-uppercase title has-text-dark is-size-1 mt-1 has-text-left block">
        {metacorp.name}
    </div>

    <div class="box">
        <div class="columns">
            <div class="column mr-1">
                <div class="has-text-weight-bold">Units Owned</div>
                {#if metacorp.unit_count}{metacorp.unit_count}{:else}Unknown.{/if}
            </div>
            <div class="column mr-1">
                <div class="has-text-weight-bold">Properties Owned</div>
                {#if metacorp.prop_count}{metacorp.prop_count}{:else}Unknown.{/if}
            </div>
        </div>
        <div class="columns">
            <div class="column mr-1">
                <div class="has-text-weight-bold">Total Assessed Value</div>
                {#if metacorp.val}${metacorp.val.toLocaleString()}{:else}Unknown.{/if}
            </div>
        </div>
    </div>
    <div class="box" style="max-height: 300px; overflow-y: auto;">
        <div class="has-text-weight-bold">Properties</div>
        {#each metacorp.sites.features as site}
            <div class="box" role="button" tabindex="0" on:click={siteNav(site.id)} on:keyup={siteNav(site.id)}>
                <div class="has-text-weight-bold">{site.properties.address.addr}</div>
                <div>{#if site.properties.address.muni}{site.properties.address.muni}, {/if}{#if site.properties.address.state}{site.properties.address.state} {/if}{#if site.properties.address.postal}{site.properties.address.postal}{/if}</div>
            </div>
        {/each}
    </div>
    <div class="box mb-3" style="max-height: 300px; overflow-y: auto;">
        <div class="has-text-weight-bold">Other Names</div>
        {#each metacorp.aliases as alias, index}
            { index == metacorp.aliases.length-1 ? alias : `${alias}, `}
        {/each}
    </div>
</div>
</Panel>