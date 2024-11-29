<script>
    import SocialIcon from "$lib/components/Panels/Cards/SocialIcon.svelte";
    export let person;
    const imageMap = import.meta.glob('$lib/assets/*.{png,jpg,jpeg}', { eager: true });
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
                <p class="title is-size-4 is-size-6-mobile">{person.name}
                    {person.creds.join(', ')}
                </p>
            </div>
        </div>
        <div class="content">
            <div class="tags">
                {#each person.roles as role}
                    <span class="tag">{role}</span>
                {/each}
            </div>
            <div class="block">
                <ul>
                    {#each person.affiliations as affil}
                    <li>{affil.title}, {affil.inst}</li>
                    {/each}
                </ul>
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