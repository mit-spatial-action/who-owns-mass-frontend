<script lang="ts">
    export let townGroups;
    export let ownerGroups;
    import IconText from "$lib/components/Panels/Cards/IconText.svelte"
    import { slide } from "svelte/transition";
    import { highlighted } from "$lib/stores";
    let openPanels = []; // Array to track open modal panels
    let activeTab = "properties";

function togglePanel(index) {
    if (openPanels.includes(index)) {
        openPanels = openPanels.filter(i => i !== index); // Close panel
    } else {
        openPanels = [...openPanels, index]; // Open panel
    }
}

$: sortedData = activeTab === "properties"
    ? townGroups : ownerGroups;

</script>
<div class="modal-card">
    <header class="modal-card-head">
            <div class="tabs is-large is-boxed">
                <ul>
                  <li class:is-active={activeTab === "properties"}>
                    <a on:click={() => activeTab = "properties"}>Properties</a></li>
                  <li class:is-active={activeTab === "owners"}>
                    <a on:click={() => activeTab = "owners"}>Owners</a></li>
                </ul>
              </div>
    </header>
    <section class="modal-card-body">
        {#each Object.entries(sortedData) as [town, sites], index}
        <div class="panel is-link is-clickable">
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <p class="panel-heading is-flex is-justify-content-space-between" on:click={() => togglePanel(index)}>
                {town + " (" + sites.length + ")"}
                <span class="icon">
                    <i class="fas" class:fa-plus={!openPanels.includes(index)} class:fa-minus={openPanels.includes(index)}></i>
                </span>
            </p>
        {#if openPanels.includes(index)}
            <div class="fixed-grid has-1-cols" transition:slide>
                <div class="grid">
                {#each sites as site}
                    <div class="cell">
                        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <div class="card border-primary is-shadowless" 
                        aria-label="Select {site.properties.address}" tabindex="0" data-sveltekit-preload-data="off"
                        on:mouseover={() => highlighted.set(site.id)} on:focus={() => highlighted.set(site.id)} on:mouseleave={() => highlighted.set(null)}>
                            <div class="card-content has-background-light">
                                <a href={`/site/${site.id}`} class="has-text-dark is-flex is-justify-content-space-between">
                                    <div>
                                        <div class="has-text-weight-bold">{site.properties.address.addr}</div>
                                        <div>{#if site.properties.address.muni}{`${site.properties.address.muni}, `}{/if}
                                            {#if site.properties.address.state}{`${site.properties.address.state} `}{/if}
                                            {#if site.properties.address.postal}{site.properties.address.postal}{/if}
                                        </div>
                                    </div>
                                    <div>
                                        <IconText icon="hand-holding-dollar">
                                            {#if site.properties.ls_price}
                                                ${(site.properties.ls_price).toLocaleString()} 
                                            {:else}
                                                Unknown
                                            {/if} 
                                            {#if site.properties.ls_date}
                                                on {new Date(site.properties.ls_date).toLocaleDateString()}
                                            {/if}
                                        </IconText>
                                        <IconText icon="dollar-sign">
                                            {#if site.properties.lnd_val > 0 && site.properties.bld_val > 0}
                                                ${(site.properties.lnd_val + site.properties.bld_val).toLocaleString()}
                                            {:else if site.properties.bld_val > 0}
                                                ${site.properties.bld_val.toLocaleString()}
                                            {:else if site.properties.lnd_val > 0}
                                                ${site.properties.lnd_val.toLocaleString()}
                                            {:else}
                                                Unknown.
                                            {/if}
                                            {#if site.properties.fy}
                                                (FY {site.properties.fy})
                                            {/if}
                                        </IconText>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                {/each}
                </div>
            </div>
        {/if}
        </div>
        {/each}
        </section>
        </div>