<script>
    import Navbar from "$lib/components/Navigation/Navbar.svelte";
    import Sidebar from "$lib/components/Navigation/Sidebar.svelte";

    import siteConfig from "$lib/config/site.json";
    
    let active = $state(false)
</script>

{#if active}
    <Sidebar menuItems={siteConfig.pages} bind:active />
{/if}
<Navbar bind:active/>