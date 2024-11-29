<script>
    export let org;
</script>

<a href="{org.url}">
    <figure class="image is-hidden-tablet is-48x48">
        <img 
            src="/src/lib/assets/logos/{org.logo}" 
            alt="Logo of {org.name}."/>
    </figure>
    <figure class="image is-hidden-mobile is-96x96">
        <img 
            src="/src/lib/assets/logos/{org.logo}" 
            alt="Logo of {org.name}."
            />
    </figure>
</a>

<style>

img {
    filter: grayscale(100);
}
</style>