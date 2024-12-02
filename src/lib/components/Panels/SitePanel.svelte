<script lang="ts">
    import HL from "$lib/components/Panels/HL.svelte";
    import CardHeader from "$lib/components/Panels/Cards/CardHeader.svelte";
    import CardContent from "$lib/components/Panels/Cards/CardContent.svelte";
    export let site;
</script>


<CardHeader>{site.address.addr}</CardHeader>

<CardContent>
    <div class="tags are-medium">
        <div class="tag is-success is-light">
            {site.address.muni}
        </div>
        <div class="tag is-success is-light">
            {site.address.postal}
        </div>
    </div>
    <div class="title">Owners</div>
    <div class="grid">
        {#each site.owners as owner, index}
            <div class="cell">
                <div class="card">
                    <div class="card-content">
                        {owner.properties.name}
                    </div>
                </div>
            </div>
        {/each}
    </div>
    <div class="block">
        {#if site.metacorp.prop_count > 1}
                <p>This owner may own <HL>{site.metacorp.prop_count}</HL> properties, including <HL>{site.metacorp.unit_count}</HL> units.</p>
                <a class="button mt-2" data-sveltekit-preload-data="off" href={`/meta/${site.metacorp.id}`}>
                    See Details &#8594
                </a>
        {:else}
                <p>We couldn't find any additional properties held by this owner.</p>
        {/if}
    </div>
    <div class="title">Property Details</div>
    <div class="grid">
        <div class="cell">
            <div class="card">
                <div class="card-content">
                    <div class="has-text-weight-bold">Year of Record</div>
                    {#if site.fy}{site.fy}{:else}Unknown.{/if}
                </div>
            </div>
        </div>
        <div class="cell">
            <div class="card">
                <div class="card-content">
                    <div class="has-text-weight-bold">Estimated Units</div>
                    {#if site.units}{site.units}{:else}Unknown.{/if}
                </div>
            </div>
        </div>
        <div class="cell">
            <div class="card">
                <div class="card-content">
                    <div class="has-text-weight-bold">Last Sale Date</div>
                    {#if site.ls_date}{new Date(site.ls_date).toLocaleDateString()}{:else}Unknown.{/if}
                </div>
            </div>
        </div>
        <div class="cell">
            <div class="card">
                <div class="card-content">
                    <div class="has-text-weight-bold">Last Sale Price</div>
                    {#if site.ls_price}${site.ls_price.toLocaleString()}{:else}Unknown.{/if}
                </div>
            </div>
        </div>
    </div>
</CardContent>