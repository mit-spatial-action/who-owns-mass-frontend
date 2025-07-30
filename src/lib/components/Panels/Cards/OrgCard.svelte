<script lang="ts">
    import SocialIcon from "$lib/components/Panels/Cards/SocialIcon.svelte";
  let { org } = $props();
    const imageMap = import.meta.glob<{ default: string }>('$lib/assets/logos/*.{png,jpg,jpeg}', { eager: true });
    const imageSrc = imageMap[`/src/lib/assets/logos/${org.logo}`]?.default || '';
</script>

<div class="card is-fullheight is-flex is-flex-direction-column">
    <div class="card-content">
        <div class="media">
            <div class="media-left">
                <figure class="image is-96x96">
                    <img
                        src={imageSrc}
                        alt="{org.name} logo."
                    />
                </figure>
            </div>
            <div class="media-content">
                <p class="title is-size-4 is-size-7-mobile p-1">{org.name}</p>
            </div>
        </div>
        {#if org.description}
        <div class="content">
            {org.description}
        </div>
        {/if}
    </div>
    <footer class="card-footer">
        {#each org.socials as url}
        <div class="card-footer-item">
        <SocialIcon {url}/>
        </div>
        {/each}
        {#if org.url}
        <div class="card-footer-item">
        <SocialIcon url={org.url}/>
        </div>
        {/if}
    </footer>
  </div>