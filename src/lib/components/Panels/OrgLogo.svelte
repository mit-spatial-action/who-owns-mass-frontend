<script>
    export let org;
    const imageMap = import.meta.glob('$lib/assets/logos/*.{png,jpg,jpeg}', { eager: true });
    const imageSrc = imageMap[`/src/lib/assets/logos/${org.logo}`]?.default || '';
</script>

<a href="{org.url}">
    <figure class="image is-hidden-tablet is-48x48">
        <img 
            src="{imageSrc}" 
            alt="Logo of {org.name}."/>
    </figure>
    <figure class="image is-hidden-mobile is-64x64">
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
</style>