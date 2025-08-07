<script lang="ts">
    import SearchPanel from "$lib/components/Search/SearchPanel.svelte";
    import LogoLink from "$lib/components/LogoLink.svelte";
    import siteConfig from "$lib/config/site.json";

    const imageMap = import.meta.glob<{ default: string }>("$lib/assets/*.{png,jpg,jpeg}", {
        eager: true,
    });
    const imageSrc = imageMap["/src/lib/assets/homes_photo.png"]?.default || "";

    let title = siteConfig.title;
</script>

<div class="card-content">
    <div class="hero is-medium mb-5">
        <div
            class="hero-body hero-image"
            style="background-image: url({imageSrc})"
        >
            <div class="title is-size-4-touch is-2 has-text-centered">
                <div class="hero-title">{title}</div>
            </div>
        </div>
    </div>
    <div class="block">
        <SearchPanel />
    </div>
</div>
<footer class="card-footer mt-auto">
    <div class="level is-mobile pt-3">
        {#each siteConfig.org as org}
            <div class="level-item">
                <LogoLink {org} />
            </div>
        {/each}
        {#each siteConfig.partners as org}
            <div class="level-item">
                <LogoLink {org} />
            </div>
        {/each}
        {#each siteConfig.funders as org}
            <div class="level-item">
                <LogoLink {org} />
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