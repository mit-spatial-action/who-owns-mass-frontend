<script lang="ts">
    import SearchPanel from '$lib/components/Search/SearchPanel.svelte';
    import ErrorMessage from "$lib/components/Panels/ErrorMessage.svelte";
    /** @type {import('./$types').PageData} */

    export let title: string = "Title";
    export let subtitle: string = "Longer description";

    import { errorState } from "$lib/stores";
 
</script>

<div id="home-panel">
    <div class="card-content mt-6">
        <div class="title is-size-1 has-text-centered">
            {title}
        </div>
        <div class="block has-text-centered">
            {subtitle}
        </div>
        <div class="block">
            <SearchPanel/>
        </div>
       {#if $errorState }
            <div class="block is-flex has-content-centered is-justify-content-center">
                <ErrorMessage errorState={$errorState} />
            </div>
        {/if}

        <div class="block has-text-centered mt-6">
            <p class="has-text-grey-light">A project of the <a href="https://mit-spatial-action.github.io/">MIT Spatial Analysis & Action Research Group</a>. Built in partnership with the <a href="https://hns.mit.edu/">Healthy Neighborhoods Study</a>, the <a href="https://www.clf.org/">Conservation Law Foundation</a>, and the <a href="https://www.mapc.org/">Metropolitan Area Planning Council</a>.</p>
        </div>
    </div>
</div>