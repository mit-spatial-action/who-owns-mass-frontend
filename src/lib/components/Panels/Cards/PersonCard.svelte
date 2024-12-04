<script>
    import SocialIcon from "$lib/components/Panels/Cards/SocialIcon.svelte";
    export let person;
    const imageMap = import.meta.glob('$lib/assets/*.{png,jpg,jpeg}', { eager: true });
    const imageSrc = imageMap[`/src/lib/assets/${person.photo}`]?.default || '';
</script>

<div class="card is-fullheight shadow is-flex is-flex-direction-column">
    <div class="card-content is-flex-grow-1">
        <div class="media">
            <div class="media-left">
                <figure class="image shadow is-96x96">
                    <img
                        src={imageSrc}
                        alt="Photo of {person.name}."
                    />
                </figure>
            </div>
            <div class="media-content">
                <p class="title is-size-4 is-size-6-mobile has-background-success-light p-1 shadow">{person.name}
                    {person.creds.join(', ')}
                </p>
                <div class="tags">
                    {#each person.roles as role}
                        <span class="tag is-success is-light">{role}</span>
                    {/each}
                </div>
            </div>
        </div>
        <div class="content">
            <div class="block">
                {#each person.affiliations as affil}
                <div class="block shadow p-2">{affil.title}, {affil.inst}</div>
                {/each}
            </div>
        </div>
    </div>
    <footer class="card-footer">
        {#each person.socials as socialUrl}
        <div class="card-footer-item">
        <SocialIcon {socialUrl}/>
        </div>
        {/each}
        {#if person.url}
        <div class="card-footer-item">
        <SocialIcon socialUrl={person.url}/>
        </div>
        {/if}
    </footer>
  </div>