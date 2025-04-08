<script lang="ts">
    import HL from "$lib/components/Panels/HL.svelte";
    import PanelTitle from "$lib/components/Panels/PanelTitle.svelte";
    import {
        highlighted
    } from "$lib/stores";
    import IconCard from "$lib/components/Panels/Cards/IconCard.svelte";
    import CardHeader from "$lib/components/Panels/Cards/CardHeader.svelte";
    import CardContent from "$lib/components/Panels/Cards/CardContent.svelte";
    import Modal from "./Modals/Modal.svelte";
    import MetaCorpModal from "./Modals/MetaCorpModal.svelte";

    export let metacorp;

    let modalOpen = false;
    let activeTab = "properties";
   
    const openModal = (modalType) => {
        modalOpen = modalOpen ? false : modalOpen; // Resets modalOpen variable 

        modalOpen = true;
        activeTab = modalType;
    }

    function handleModalClose() {
        modalOpen = false;
    }

    function sortMetacorpProperties() {

        const sortedProperties = [...metacorp.sites.features].sort((a, b) => {
            // Check if all necessary fields are present
            if (
                a.properties.address.muni && b.properties.address.muni &&
                a.properties.address.body && b.properties.address.body &&
                a.properties.address.start && b.properties.address.start
            ) {
                //Compare "muni"
                const muniCompare = a.properties.address.muni.localeCompare(b.properties.address.muni);
                if (muniCompare !== 0) return muniCompare;

                // If "muni" is the same, compare "body"
                const bodyCompare = a.properties.address.body.localeCompare(b.properties.address.body);
                if (bodyCompare !== 0) return bodyCompare;

                // If both "muni" and "body" are the same, compare "start"
                return a.properties.address.start.localeCompare(b.properties.address.start);
            }
            // Return 0 if no matching properties, or default fallback logic
            return 0;
        });

        const groupedData = sortedProperties.reduce((acc, item) => {
            if (!acc[item.properties.address.muni]) acc[item.properties.address.muni] = [];
            acc[item.properties.address.muni].push(item);
            return acc;
        }, {});
    
      return(groupedData);
    }

    function sortMetacorpOwners() {

        const sortedProperties = [...metacorp.sites.features].sort((a, b) => {
            // Check if all necessary fields are present
            if (
                a.properties.address.muni && b.properties.address.muni &&
                a.properties.address.body && b.properties.address.body &&
                a.properties.address.start && b.properties.address.start
            ) {
                // First compare "muni"
                const muniCompare = a.properties.address.muni.localeCompare(b.properties.address.muni);
                if (muniCompare !== 0) return muniCompare;

                // If "muni" is the same, compare "body"
                const bodyCompare = a.properties.address.body.localeCompare(b.properties.address.body);
                if (bodyCompare !== 0) return bodyCompare;

                // If both "muni" and "body" are the same, compare "start"
                return a.properties.address.start.localeCompare(b.properties.address.start);
            }

            // Return 0 if no matching properties, or default fallback logic
            return 0;
        });

        const groupedOwnerData = sortedProperties.reduce((acc, item) => {
            if (!acc[item.properties.owners[0].properties.name]) acc[item.properties.owners[0].properties.name] = [];
            acc[item.properties.owners[0].properties.name].push(item);
            return acc;
        }, {});

        return(groupedOwnerData);
        }
    const groupedMetaCorpData = sortMetacorpProperties();
    const groupedOwnerCorpData = sortMetacorpOwners();
    
    console.log(metacorp);
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
                <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
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
        <button class="button border-primary" data-sveltekit-preload-data="off" aria-label="See all Properties"  on:click={openModal("properties")}>
            See All {metacorp.sites.features.length} Properties &#8594
        </button>
    </div>
    {/if}

    {#if modalOpen}
    <Modal bind:open={modalOpen} closeBtn={true} background={"has-background-dark opacity-50 "}>
        <MetaCorpModal townGroups={groupedMetaCorpData} ownerGroups={groupedOwnerCorpData} activeTab={activeTab}/>
    </Modal> 
    {/if}

    {#if metacorp.aliases.length > 1}
        <div class="title">Other Names</div>
        <div class="fixed-grid">
            <div class="grid">
                    {#each metacorp.aliases.slice(0, 6) as alias, index}
                    <div class="cell">
                        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <div class="card border-primary is-shadowless" 
                        aria-label="Select {alias}" tabindex="0" data-sveltekit-preload-data="off">
                            <div class="card-content">
                                <div class="has-text-weight-bold">{alias}</div>
                            </div>
                        </div>
                    </div>
                    {/each}
                </div>
        </div>
        {#if metacorp.aliases.length > 4}
            <div class="block buttons is-right">
                <button class="button border-primary" data-sveltekit-preload-data="off" aria-label="See all Properties"  on:click={openModal("owners")}>
                    See All {metacorp.aliases.length - 1} Associated Companies &#8594
                </button>
            </div>
        {/if}
    {/if}
</CardContent>


<style>
    .box {
        border-radius: 0;
    }
</style>