<script lang="ts">
    import SocialIcon from "$lib/components/Cards/SocialIcon.svelte";
  let { person } = $props();
    const imageMap = import.meta.glob<{ default: string }>('$lib/assets/*.{png,jpg,jpeg}', { eager: true });
    const imageSrc = imageMap[`/src/lib/assets/${person.photo}`]?.default || '';
</script>

<div class="card is-fullheight is-flex is-flex-direction-column">
    <div class="card-content is-flex-grow-1">
        <div class="media">
            <div class="media-left">
                <figure class="image is-96x96">
                    <img
                        src={imageSrc}
                        alt="Photo of {person.name}."
                    />
                </figure>
            </div>
            <div class="media-content">
                <p class="title is-size-4 is-size-6-mobile p-1">{person.name}
                    {person.creds.join(', ')}
                </p>
                <div class="tags">
                    {#each person.roles as role}
                        <span class="tag">{role}</span>
                    {/each}
                </div>
            </div>
        </div>
        <div class="content">
            <div class="block">
                {#each person.affiliations as affil}
                <div class="block p-2">{affil.title}, {affil.inst}</div>
                {/each}
            </div>
        </div>
    </div>
    <footer class="card-footer">
        {#each person.socials as url}
            <div class="card-footer-item">
            <SocialIcon {url}/>
        </div>
        {/each}
        {#if person.url}
            <div class="card-footer-item">
            <SocialIcon url={person.url}/>
        </div>
        {/if}
    </footer>
  </div>