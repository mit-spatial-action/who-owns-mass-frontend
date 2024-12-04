<script lang="ts">

    import SearchPanel from '$lib/components/Search/SearchPanel.svelte';
    import OrgLogo from '$lib/components/Panels/OrgLogo.svelte';
    import ErrorMessage from "$lib/components/Panels/ErrorMessage.svelte";
    import siteConfig from "$lib/config/site.json";
    
    /** @type {import('./$types').PageData} */

    export let title: string = "Title";
    export let subtitle: string = "Longer description";

    const imageMap = import.meta.glob('$lib/assets/*.{png,jpg,jpeg}', { eager: true });
    const imageSrc = imageMap['/src/lib/assets/homes_photo.png']?.default || '';

    import { errorState } from "$lib/stores";
 
</script>

<div class="card-content">
    <div class="hero is-success is-medium mb-5 border-success">
        <div class="hero-body hero-image" style="background-image: url({imageSrc})">
            <div class="title is-4 is-hidden-tablet has-text-white has-text-centered">
                <div class="hero-title">{title}</div>
            </div>
            <div class="title is-2 is-hidden-mobile has-text-white has-text-centered">
                <div class="hero-title">{title}</div>
            </div>
            <!-- <div class="block has-text-centered">
                {subtitle}
            </div> -->
        </div>
    </div>
    <div class="block">
        <SearchPanel/>
    </div>
    {#if $errorState }
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
    @use 'src/lib/styles/vars.scss' as *;
    .level {
        width: 100%;
    }
    .hero-image {
        background-size: cover;
        filter: grayscale(1);
        mix-blend-mode: hard-light;
        padding: 6rem 1rem !important;
    }
    .hero-title {
        text-shadow: 0.2rem 0.2rem 0px $primary;
    }
</style>