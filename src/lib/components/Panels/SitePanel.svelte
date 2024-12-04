<script lang="ts">
    import HL from "$lib/components/Panels/HL.svelte";
    import CardHeader from "$lib/components/Panels/Cards/CardHeader.svelte";
    import CardContent from "$lib/components/Panels/Cards/CardContent.svelte";
    import ErrorMessage from "./ErrorMessage.svelte";
   export let site;
</script>

<CardHeader>{site.address.addr}</CardHeader>

<CardContent>
    <div class="tags are-medium">
        <div class="tag is-success is-light shadow">
            {site.address.muni}
        </div>
        <div class="tag is-success is-light shadow">
            {site.address.postal}
        </div>
    </div>
    <div class="box shadow">
        <div class="title box has-background-success-light shadow is-shadowless">Owners</div>
        <div class="grid">
            {#each site.owners as owner, index}
                <div class="cell">
                    <div class="card shadow is-shadowless">
                        <div class="card-content">
                            {owner.properties.name}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
        <div class="block">
            {#if site.metacorp.prop_count > 1}
                    <p>This owner may own <HL>{site.metacorp.prop_count} properties</HL>, including <HL>{site.metacorp.unit_count} units</HL>.</p>
                    <a class="button mt-5 shadow is-shadowless" data-sveltekit-preload-data="off" href={`/meta/${site.metacorp.id}`}>
                        See Details &#8594
                    </a>
            {:else}
                    <p>We couldn't find any additional properties held by this owner.</p>
            {/if}
        </div>
    </div>
    <div class="box shadow">
        <div class="title box has-background-success-light shadow is-shadowless">Property Details</div>
        <div class="grid">
            <div class="cell">
                <div class="card shadow is-shadowless">
                    <div class="card-content">
                        <div class="has-text-weight-bold">Year</div>
                        {#if site.fy}{site.fy}{:else}Unknown.{/if}
                    </div>
                </div>
            </div>
            <div class="cell">
                <div class="card shadow is-shadowless">
                    <div class="card-content">
                        <div class="tag is-medium has-background-success-light">
                            <div class="icon-text">
                                <span class="icon has-text-success">
                                <i class="fas fa-house"></i>
                                </span>
                                <span>Units</span>
                            </div>
                            </div>
                            {#if site.units}{site.units}{:else}Unknown.{/if}
                    </div>
                </div>
            </div>
            <div class="cell">
                <div class="card shadow is-shadowless">
                    <div class="card-content">
                        <div class="has-text-weight-bold">Last Sale Date</div>
                        {#if site.ls_date}{new Date(site.ls_date).toLocaleDateString()}{:else}Unknown.{/if}
                    </div>
                </div>
            </div>
            <div class="cell">
                <div class="card shadow is-shadowless">
                    <div class="card-content">
                        <div class="has-text-weight-bold">Last Sale Price</div>
                        {#if site.ls_price}${site.ls_price.toLocaleString()}{:else}Unknown.{/if}
                    </div>
                </div>
            </div>
        </div>
        {#if site.ls_price < 5000}
            <div class="card shadow is-shadowless">
                <ErrorMessage errorState="quitClaimDeed"/>
            </div> 
        {/if}
    </div>
</CardContent>

<style>
    .box {
        border-radius: 0;
    }
</style>