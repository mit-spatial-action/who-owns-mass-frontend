<script lang="ts">
    import HL from "$lib/components/Panels/HL.svelte";
    import PanelTitle from "$lib/components/Panels/PanelTitle.svelte";
    import {
        highlighted
    } from "$lib/stores";
    import IconCard from "$lib/components/Panels/Cards/IconCard.svelte";
    import CardHeader from "$lib/components/Panels/Cards/CardHeader.svelte";
    import CardContent from "$lib/components/Panels/Cards/CardContent.svelte";
    import Modal from "../Modal.svelte";
    export let metacorp;

    let modalOpen = false;
   
    function openModal() {
        modalOpen = true;
    }

    function handleModalClose() {
        modalOpen = false;
    }

    let openPanels = []; // Array to track open modal panels

    function togglePanel(index) {
        if (openPanels.includes(index)) {
            openPanels = openPanels.filter(i => i !== index); // Close panel
        } else {
            openPanels = [...openPanels, index]; // Open panel
        }
    }

    function sortMetacorpProperties() {
        const sortedProperties = [...metacorp.sites.features].sort((a,b) => 
            a.properties.address.muni === b.properties.address.muni ? 
            a.properties.address.addr.localeCompare(b.properties.address.addr) : 
            a.properties.address.muni.localeCompare(b.properties.address.muni)
        );

        const groupedData = sortedProperties.reduce((acc, item) => {
            if (!acc[item.properties.address.muni]) acc[item.properties.address.muni] = [];
            acc[item.properties.address.muni].push(item);
            return acc;
        }, {});

      return(groupedData);
    }

    const groupedMetaCorpData = sortMetacorpProperties();
    console.log(groupedMetaCorpData);

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
        <button class="button border-primary" data-sveltekit-preload-data="off" aria-label="See all Properties"  on:click={openModal}>
            See All {metacorp.sites.features.length} Properties &#8594
        </button>
    </div>
    {/if}

    {#if modalOpen}
    <Modal bind:open={modalOpen} closeBtn={true} background={"has-background-dark opacity-50 "}>
        <div class="modal-card">
        <header class="modal-card-head">
                <div class="tabs">
                    <ul>
                      <li class="is-active"><a>Properties</a></li>
                      <li><a>Owners</a></li>
                    </ul>
                  </div>
        </header>
        <section class="modal-card-body">

            {#each Object.entries(groupedMetaCorpData) as [town, property], index}
            <div class="panel is-link is-clickable">
                <p class="panel-heading is-flex is-justify-content-space-between" on:click={() => togglePanel(index)}>{town}
                    <span class="icon">
                        <i class="fas" class:fa-plus={!openPanels.includes(index)} class:fa-minus={openPanels.includes(index)}></i>
                    </span>
                </p>
            {#if openPanels.includes(index)}
                <div class="fixed-grid has-1-cols">
                    <div class="grid">
                    {#each property as site}
                        <div class="cell">
                            <div class="card border-primary is-shadowless" 
                            aria-label="Select {site.properties.address}" tabindex="0" data-sveltekit-preload-data="off"
                            on:mouseover={() => highlighted.set(site.id)} on:focus={() => highlighted.set(site.id)} on:mouseleave={() => highlighted.set(null)}>
                                <div class="card-content has-background-light">
                                    <a href={`/site/${site.id}`} class="has-text-dark">
                                    <div class="has-text-weight-bold">{site.properties.address.addr}</div>
                                    <div>{#if site.properties.address.muni}{`${site.properties.address.muni}, `}{/if}
                                        {#if site.properties.address.state}{`${site.properties.address.state} `}{/if}
                                        {#if site.properties.address.postal}{site.properties.address.postal}{/if}</div>
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
    </Modal> 
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