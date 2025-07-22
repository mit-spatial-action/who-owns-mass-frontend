<script lang="ts">

    import SearchPanel from '$lib/components/Search/SearchPanel.svelte';
    import OrgLogo from '$lib/components/Panels/OrgLogo.svelte';
    import ErrorMessage from "$lib/components/Panels/ErrorMessage.svelte";
    import siteConfig from "$lib/config/site.json";
    
    


    const imageMap = import.meta.glob('$lib/assets/*.{png,jpg,jpeg}', { eager: true });
    const imageSrc = imageMap['/src/lib/assets/homes_photo.png']?.default || '';

    import { errorState } from "$lib/stores";
    interface Props {
        /** @type {import('./$types').PageData} */
        title?: string;
    }

    let { title = "Title" }: Props = $props();
 
</script>

<div class="card-content">
    <div class="hero is-medium mb-5">
        <div class="hero-body hero-image" style="background-image: url({imageSrc})">
            <div class="title is-size-4-touch is-2 has-text-centered">
                <div class="hero-title">{title}</div>
            </div>
        </div>
    </div>
    <div class="block">
        <SearchPanel/>
    </div>
    {#if $errorState}
        <div class="block is-flex has-content-centered is-justify-content-center">
            <ErrorMessage errorState={$errorState} />
        </div>
    {/if}
</div>
<footer class="card-footer mt-auto">
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
</footer>

<style lang="scss">
    .level {
        width: 100%;
    }
    .hero-image {
        background-size: cover;
        filter: grayscale(1);
    }
</style>