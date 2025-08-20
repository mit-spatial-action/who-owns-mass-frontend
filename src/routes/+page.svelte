<script lang="ts">
    import LogoLink from "$lib/components/LogoLink.svelte";
    import siteConfig from "$lib/config/site.json";

    const imageMap = import.meta.glob<{ default: string }>(
        "$lib/assets/*.{png,jpg,jpeg}",
        {
            eager: true,
        },
    );
    const imageSrc = imageMap["/src/lib/assets/homes_photo.png"]?.default || "";

    let title = siteConfig.title;
</script>

<div class="box hero hero-image"
        style="background-image: url({imageSrc})">
    <div
        class="hero-body"
    >
        <div class="title is-size-4-touch is-3 has-text-centered">
            {title}
        </div>
    </div>
</div>
<!-- <div class="box mt-auto">
    <div class="level pt-3">
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
</div> -->

<style lang="scss">
    .level {
        width: 100%;
    }
    .container {
        height: 100%
    }
    .hero-image {
        background-size: cover;
        filter: grayscale(1);
    }
</style>
