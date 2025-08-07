<script lang="ts">
    let { org } = $props();
    const imageMap = import.meta.glob<{ default: string }>('$lib/assets/logos/*.{png,jpg,jpeg}', { eager: true });
    const imageSrc = imageMap[`/src/lib/assets/logos/${org.logo}`]?.default || '';
</script>

<a href="{org.url}">
    <figure class="image is-hidden-tablet is-48x48">
        <span class="has-background-success"></span>
        <img 
            src="{imageSrc}" 
            alt="Logo of {org.name}."/>
    </figure>
    <figure class="image is-hidden-mobile is-64x64">
        <span class="has-background-success"></span>
        <img 
            src="{imageSrc}" 
            alt="Logo of {org.name}."
            />
    </figure>
</a>

<style>

img {
    filter: grayscale(100);
}

span {
    display: block;
    position: fixed;
    width: inherit;
    height: inherit;
    z-index:2;
    mix-blend-mode: overlay;
}

</style>