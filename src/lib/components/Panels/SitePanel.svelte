<script lang="ts">
    import HL from "$lib/components/Panels/HL.svelte";
    import CardHeader from "$lib/components/Panels/Cards/CardHeader.svelte";
    import CardContent from "$lib/components/Panels/Cards/CardContent.svelte";
    import IconCard from "$lib/components/Panels/Cards/IconCard.svelte";
    import ErrorMessage from "./ErrorMessage.svelte";
   export let site;

   let priceInfoActive = true;

   const toggleActive = () => {
      priceInfoActive = !priceInfoActive;
    }
    console.log(site);

</script>

<CardHeader color="primary">{site.address.addr}</CardHeader>

<CardContent>
    <div class="box p-0 is-shadowless">
        <div class="tag is-medium is-primary is-light border-primary">
            {site.address.muni}
        </div>
        <div class="tag is-medium is-primary is-light border-primary">
            {site.address.postal}
        </div>
    </div>
    <div class="fixed-grid has-2-cols">
        <div class="grid">
            <div class="cell">
                <IconCard title="Period" icon="calendar">
                    {#if site.fy }July 1, {site.fy-1}--June 30, {site.fy}{:else}Unknown.{/if}
                </IconCard>
            </div>
            <div class="cell">
                <IconCard title="Units" icon="building">
                    {#if site.units}{#if site.ooc}{site.units - 1}{:else}{Math.round(site.units)}{/if} Rental Units{:else}Unknown.{/if}
                </IconCard>
            </div>
            <div class="cell">
                <IconCard title="Last Sale" icon="hand-holding-dollar">
                    {#if site.ls_price}${site.ls_price.toLocaleString()}{:else}Unknown{/if}{#if site.ls_price < 5000}
                    <a class="icon" on:click={toggleActive}>
                        <i class="fas fa-question-circle has-text-primary"></i>
                    </a>
                    {/if} on {#if site.ls_date}{new Date(site.ls_date).toLocaleDateString()}{:else}Unknown.{/if}
                </IconCard>

            <div class="cell">
                {#if site.ooc}
                <IconCard title="Owner-Occupied" icon="house"/>
                {:else}
                <IconCard title="Absentee Landlord" icon="people-arrows"/>
                {/if}
            </div>
            </div>
            <div class="cell">
                <IconCard title="Valuation" icon="dollar-sign">
                    {#if site.lnd_val > 0 && site.bld_val > 0}
                        ${(site.lnd_val + site.bld_val).toLocaleString()}
                    {:else if site.bld_val > 0}
                        ${site.bld_val.toLocaleString()}
                    {:else if site.lnd_val > 0}
                        ${site.lnd_val.toLocaleString()}
                    {:else}
                        Unknown.
                    {/if}
                </IconCard>
            </div>
        </div>
    </div>
    {#if !priceInfoActive && site.ls_price}
        <ErrorMessage errorState="quitClaimDeed" />
    {:else if !priceInfoActive }
        <ErrorMessage errorState="priceUnknown" />
    {/if}
    <div class="title">Owners</div>
    <div class="fixed-grid has-2-cols">
        <div class="grid">
            {#each site.owners as owner, index}
                <div class="cell">
                    <div class="card border-primary is-shadowless">
                        <div class="card-content">
                            <span class="icon-text">
                                <span class="icon has-text-primary">
                                    <i class="fas fa-people-group"></i>
                                </span>
                                <span class="has-text-weight-bold">{owner.properties.name}</span>
                                </span>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
    <div class="block">
        {#if site.metacorp.prop_count > 1}
                <p>This owner may own <span class="tag is-medium has-background-primary-light">{site.metacorp.prop_count} properties</span>, including <span class="tag is-medium has-background-primary-light">{site.metacorp.unit_count} units</span>.</p>
                <a class="button mt-5 border-primary is-shadowless" data-sveltekit-preload-data="off" href={`/meta/${site.metacorp.id}`}>
                    See Details &#8594
                </a>
        {:else}
            <ErrorMessage errorState="noProperties" />
        {/if}
    </div>
</CardContent>

<style>
    .box {
        border-radius: 0;
    }
</style>