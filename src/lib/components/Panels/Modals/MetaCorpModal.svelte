<script lang="ts">
    export let townGroups;
    export let ownerGroups;
    export let activeTab: string | null = "properties";

    import IconText from "$lib/components/Panels/Cards/IconText.svelte"
    import { slide } from "svelte/transition";
    import { highlighted } from "$lib/stores";
    let openPanels = []; // Array to track open modal panels

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
<div class="modal-content">
    <div class="box">
        <div class="tabs is-boxed">
            <ul>
                <li class:is-active={activeTab === "properties"}>
                    <a 
                        role="button" 
                        href="#" 
                        tabindex=0 onclick={() => activeTab = "properties"} 
                        onkeydown={() => activeTab = "properties"}>
                        Properties
                    </a>
                </li>
                <li class:is-active={activeTab === "owners"}>
                    <a 
                        role="button" 
                        href="#" 
                        tabindex=0 
                        onclick={() => activeTab = "owners"} 
                        onkeydown={() => activeTab = "owners"}>
                        Owners
                    </a>
                </li>
            </ul>
        </div>

    {#each Object.entries(sortedData) as [town, sites], index}
    <div class="panel is-link is-clickable">
        <span
            role="button"
            tabindex=0
            class="has-background-success p-2 has-text-white is-flex is-justify-content-space-between" 
            onclick={() => togglePanel(index)}
            onkeydown={() => togglePanel(index)}
            >
            {town + " (" + sites.length + ")"}
            <span class="icon">
                <i class="fas" class:fa-plus={!openPanels.includes(index)} class:fa-minus={openPanels.includes(index)}></i>
            </span>
        </span>
        {#if openPanels.includes(index)}
        <div class="fixed-grid has-1-cols" transition:slide>
            <div class="grid">
            {#each sites as site}
                <div class="cell">
                    <div 
                        class="card border-primary is-shadowless" 
                        role="button"
                        tabindex=0
                        aria-label="Select {site.properties.address}"
                        data-sveltekit-preload-data="off"
                        onmouseover={() => highlighted.set(site.id)} 
                        onfocus={() => highlighted.set(site.id)}
                        onmouseleave={() => highlighted.set(null)}>
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
    </div>
</div>