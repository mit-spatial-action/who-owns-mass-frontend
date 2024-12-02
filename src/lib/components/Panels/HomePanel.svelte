<script lang="ts">

    import { slide } from 'svelte/transition';
    import SearchPanel from '$lib/components/Search/SearchPanel.svelte';
    import OrgLogo from '$lib/components/Panels/OrgLogo.svelte';
    import ErrorMessage from "$lib/components/Panels/ErrorMessage.svelte";
    import siteConfig from "$lib/config/site.json";
    
    /** @type {import('./$types').PageData} */

    export let title: string = "Title";
    export let subtitle: string = "Longer description";

    import { errorState } from "$lib/stores";
 
</script>

<div transition:slide={{duration:250, axis:"y"}}>
<div class="card-content is-flex-grow-1">
    <div class="title is-size-3 is-size-1-tablet has-text-centered">
        {title}
    </div>
    <!-- <div class="block has-text-centered">
        {subtitle}
    </div> -->
    <div class="block">
        <SearchPanel/>
    </div>
    {#if $errorState }
        <div class="block is-flex has-content-centered is-justify-content-center">
            <ErrorMessage errorState={$errorState} />
        </div>
    {/if}
</div>
<hr/>
<!-- <footer class="card-footer"> -->
    <div class="level is-mobile pt-3">
        {#each siteConfig.org as org}
            <div class="level-item">
                <OrgLogo {org}/>
            </div>
        {/each}
        {#each siteConfig.partners as org}
            <div class="level-item">
                <OrgLogo {org}/>
            </div>
        {/each}
        {#each siteConfig.funders as org}
            <div class="level-item">
                <OrgLogo {org}/>
            </div>
        {/each}
    </div>
    <div class="level has-text-centered">
        <!-- <div class="level-item"> -->
            Built by the MIT Spatial Action and Analysis Research Group.
        <!-- </div> -->
    </div>
</div>
<!-- </footer> -->

<style>
    .level {
        width: 100%;
    }
</style>