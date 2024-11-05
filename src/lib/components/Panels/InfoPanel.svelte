<script>
    import site_data from '$lib/config/instance.json';
    import Navbar from '$lib/components/Navbar/Navbar.svelte';
    import Panel from "$lib/components/Panels/Panel.svelte";
</script>

<Panel>
    <div id="info">
        <div class="block">
            <Navbar menuItems={site_data.pages}/>
        </div>
        <slot/>
    </div>
</Panel>

<style>
#info {
    padding: 1.5rem;
}
</style>